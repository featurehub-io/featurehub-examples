import * as React from 'react';
import { Configuration, DefaultApi, Todo } from './api';
import './App.css';
import globalAxios from 'axios';
import {
    FeatureContext,
    FeatureHubPollingClient,
    featureHubRepository,
    FeatureStateHolder,
    FeatureUpdater,
    Readyness,
    StrategyAttributeCountryName,
    StrategyAttributeDeviceName
} from 'featurehub-repository/dist';
import { FeatureHubEventSourceClient } from 'featurehub-eventsource-sdk/dist';

declare global {
    interface Window {
        FeatureUpdater: any;
        PollingService: any;
        Repository: any;
    }
}

window.FeatureUpdater = FeatureUpdater;
window.PollingService = FeatureHubPollingClient;
window.Repository = featureHubRepository;

let todoApi: DefaultApi;

let initialized = false;

class TodoData {
    todos: Array<Todo>;
    buttonColour: string | undefined;
    ready: boolean = false;
    featuresUpdated: boolean = false;

    constructor(todos?: Array<Todo>, buttonColour?: string, ready?: boolean) {
        this.todos = todos || [];
        this.buttonColour = buttonColour || 'blue';
        this.ready = ready || false;
    }

    changeColor(colour: string | undefined): TodoData {
        return new TodoData(this.todos, colour, true);
    }

    changeTodos(todos: Array<Todo>): TodoData {
        return new TodoData(todos, this.buttonColour, this.ready);
    }

}

class ConfigData {
    todoServerBaseUrl: string;
    fhServerBaseUrl: string;
    sdkUrl: string;
}

class App extends React.Component<{}, { todos: TodoData }> {
    private titleInput: HTMLInputElement;
    private eventSource: FeatureHubEventSourceClient;

    constructor() {
        super([]);

        this.state = {
            todos: new TodoData(),
        };
    }

    async initializeFeatureHub() {
        if (featureHubRepository.readyness === Readyness.Ready || this.eventSource) {
            return;
        }
        featureHubRepository.addReadynessListener((readyness) => {
            if (!initialized) {
                console.log('readyness', readyness);
                if (readyness === Readyness.Ready) {
                    initialized = true;
                    const color = featureHubRepository.getString('SUBMIT_COLOR_BUTTON');
                    this.setState({todos: this.state.todos.changeColor(color)});
                }
            }
        });

        featureHubRepository.clientContext.userKey('auntie')
            .country(StrategyAttributeCountryName.NewZealand)
            .device(StrategyAttributeDeviceName.Browser)
            .build();

        // load the config from the config json file
        const config = (await globalAxios.request({url: 'featurehub-config.json'})).data as ConfigData;
        // setup the api
        todoApi = new DefaultApi(new Configuration({basePath: config.todoServerBaseUrl}));
        this._loadInitialData(); // let this happen in background

        // listen for features from the specified SDK Url for a given environment
        this.eventSource = new FeatureHubEventSourceClient(`${config.fhServerBaseUrl}/features/${config.sdkUrl}`);
        this.eventSource.init();

        // react to incoming feature changes in real-time
        featureHubRepository.getFeatureState('SUBMIT_COLOR_BUTTON').addListener((fs: FeatureStateHolder) => {
            this.setState({todos: this.state.todos.changeColor(fs.getString())});
        });

        // featureHubRepository.addAnalyticCollector(new GoogleAnalyticsCollector('UA-1234', '1234-5678-abcd-1234'));
    }

    async componentDidMount() {
        this.initializeFeatureHub();
    }

    async _loadInitialData() {
        const todoResult = (await todoApi.listTodos({})).data;
        this.setState({todos: this.state.todos.changeTodos(todoResult)});
    }

    componentWillUnmount(): void {
        if (this.eventSource) {
            this.eventSource.close();
        }
    }

    async addTodo(title: string) {
        const todo: Todo = {
            id: '',
            title,
            resolved: false,
        };

        FeatureContext.logAnalyticsEvent('todo-add', new Map([['gaValue', '10']])); // no cid
        const todoResult = (await todoApi.addTodo(todo)).data;
        this.setState({todos: this.state.todos.changeTodos(todoResult)});
    }

    async removeToDo(id: string) {
        FeatureContext.logAnalyticsEvent('todo-remove', new Map([['gaValue', '5']]));
        const todoResult = (await todoApi.removeTodo(id)).data;
        this.setState({todos: this.state.todos.changeTodos(todoResult)});
    }

    async doneToDo(id: string) {
        const todoResult = (await todoApi.resolveTodo(id)).data;
        this.setState({todos: this.state.todos.changeTodos(todoResult)});
    }

    render() {
        if (!this.state.todos.ready) {
            return (
                <div className="App">
                    <h1>Waiting for initial features.</h1>
                </div>
            );
        }
        let buttonStyle = {
            color: this.state.todos.buttonColour
        };
        return (
            <div className="App">
                <h1>Todo List</h1>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        this.addTodo(this.titleInput.value);
                        this.titleInput.value = '';
                    }}
                >
                    <input
                        ref={node => {
                            if (node !== null) {
                                this.titleInput = node;
                            }
                        }}
                    />
                    <button type="submit" style={buttonStyle}>Add</button>
                </form>
                <ul>
                    {this.state.todos.todos.map((todo, index) => {
                        return (
                            <li
                                className="qa-main"
                                key={index}
                                style={{
                                    textDecoration: todo.resolved ? 'line-through' : 'none',
                                }}
                            >
                                {!todo.resolved && (
                                    <button
                                        onClick={() => this.doneToDo(todo.id || '')}
                                        className="qa-done-button"
                                    >Done
                                    </button>
                                )}
                                <button onClick={() => this.removeToDo(todo.id || '')} className="qa-delete-button">
                                    Delete
                                </button>
                                {' '}
                                {todo.title}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

export default App;
