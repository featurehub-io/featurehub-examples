import * as React from 'react';
import { Configuration, DefaultApi, Todo } from './api';
import './App.css';
import globalAxios, {AxiosRequestConfig} from 'axios';
import { ClientContext,
    EdgeFeatureHubConfig,
    Readyness,
    FeatureHubEventSourceClient,
    StrategyAttributeCountryName,
    GoogleAnalyticsCollector,
    } from 'featurehub-eventsource-sdk';

let todoApi: DefaultApi;
let initialized = false;
let fhConfig: EdgeFeatureHubConfig;
let fhContext: ClientContext;

class TodoData {
    todos: Array<Todo>;
    backgroundColor: string;
    ready: boolean = false;
    featuresUpdated: boolean = false;

    constructor(todos?: Array<Todo>, backgroundColor?: string, ready?: boolean) {
        this.todos = todos || [];
        this.backgroundColor = backgroundColor || 'blue';
        this.ready = ready || false;
    }

    changeColor(colour: string | undefined): TodoData {
        return new TodoData(this.todos, colour, true);
    }

    changeTodos(todos: Array<Todo>): TodoData {
        return new TodoData(todos, this.backgroundColor, this.ready);
    }

}

class ConfigData {
    todoServerBaseUrl: string;
    fhEdgeUrl: string;
    fhApiKey: string;
}

globalAxios.interceptors.request.use(function (config: AxiosRequestConfig) {
    const baggage = w3cBaggageHeader({repo: featureHubRepository, header: config.headers.Baggage});
    // const baggage = w3cBaggageHeader({});
    if (baggage) {
        console.log('baggage is ', baggage);
        config.headers.Baggage = baggage;
    } else {
        console.log('no baggage');
    }
    return config;
}, function (error: any) {
    // Do something with request error
    return Promise.reject(error);
});

var repo: FeatureHubRepository;

class App extends React.Component<{}, { todos: TodoData }> {
    private titleInput: HTMLInputElement;
    private userName: HTMLInputElement;
    private eventSource: FeatureHubEventSourceClient;

    constructor() {
        super([]);

        this.state = {
            todos: new TodoData(),
        };
    }

    async initializeFeatureHub() {

        const config = (await globalAxios.request({url: 'featurehub-config.json'})).data as ConfigData;
        fhConfig = new EdgeFeatureHubConfig(config.fhEdgeUrl, config.fhApiKey);
        const ls = new LocalSessionInterceptor();
        fhConfig.repository().addValueInterceptor(ls);

        fhContext = await fhConfig.newContext().build();
        fhConfig.repository().addReadynessListener((readyness) => {
            if (!initialized) {
                if (readyness === Readyness.Ready) {
                    initialized = true;
                    const color = fhContext.getString('SUBMIT_COLOR_BUTTON');
                    this.setState({todos: this.state.todos.changeColor(color)});
                }
            }

        });

        // Uncomment this if you want to use rollout strategy with a country rule
        // fhContext
        //     .country(StrategyAttributeCountryName.Australia)
        //     .build();

        // connect to the backend server
        todoApi = new DefaultApi(new Configuration({basePath: config.todoServerBaseUrl}));
        this._loadInitialData(); // let this happen in background

        // react to incoming feature changes in real-time
        fhConfig.repository().feature('SUBMIT_COLOR_BUTTON').addListener(fs => {
            this.setState({todos: this.state.todos.changeColor(fs.getString())});
        });

        // connect to Google Analytics
        // fhConfig.repository().addAnalyticCollector(new GoogleAnalyticsCollector('UA-1234', '1234-5678-abcd-1234'));
    }

    async componentDidMount() {
        this.initializeFeatureHub();
    }

    async _loadInitialData() {
        const todoResult = (await todoApi.listTodos({})).data;
        this.setState({todos: this.state.todos.changeTodos(todoResult)});
    }

    componentWillUnmount(): void {
        fhConfig.close(); // tidy up
    }

    async addTodo(title: string) {
        const todo: Todo = {
            id: '',
            title,
            resolved: false,
        };

        // Send an event to Google Analytics
        fhContext.logAnalyticsEvent('todo-add', new Map([['gaValue', '10']]));
        const todoResult = (await todoApi.addTodo(todo)).data;
        this.setState({todos: this.state.todos.changeTodos(todoResult)});
    }

    async removeToDo(id: string) {
        fhContext.logAnalyticsEvent('todo-remove', new Map([['gaValue', '5']]));
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
        let backgroundColor = {
            backgroundColor: this.state.todos.backgroundColor
        };
        return (
            <div className="App" style={backgroundColor}>
                {this.state.todos.featuresUpdated &&
                (<div className="updatedFeatures">There are updated features available.
                    <button onClick={() => window.location.reload()}>REFRESH</button></div>)}
                <h1>Todo List</h1>
                <div className="username">
                    <form>
                        <span>Name</span>
                        <input
                            ref={node => {
                                if (node != null) {
                                    this.userName = node; // refresh the
                                }
                            }}
                        />
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                featureHubRepository.clientContext.userKey(this.userName.value).build();
                            }}
                        >Set name
                        </button>
                    </form>
                </div>
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
                    <button type="submit">Add</button>
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
