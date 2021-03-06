import * as restify from 'restify';
import * as corsMiddleware from 'restify-cors-middleware';
import { ITodoApiController, Todo, TodoApiRouter } from "./generated-interface";
import { FeatureHubEventSourceClient } from 'featurehub-eventsource-sdk/dist';
import { featureHubRepository, GoogleAnalyticsCollector, Readyness, StrategyAttributeCountryName, StrategyAttributeDeviceName, StrategyAttributePlatformName, featurehubMiddleware, FeatureHubRepository} from 'featurehub-repository/dist';

if (process.env.FEATUREHUB_APP_ENV_URL === undefined) {
  console.error('You must define the location of your feature hub SDK URL in the environment variable FEATUREHUB_APP_ENV_URL');
  process.exit(-1);
}

//provide APP_ENV_URL, e.g. 'http://localhost:8553/features/default/ff8635ef-ed28-4cc3-8067-b9ffd8882100/lOopBkGPALBcI0p6AGpf4jAdUi2HxR0RkhYvV00i1XsMQLWkltaoFvEfs7uFsZaQ45kF5FmhGE7rWTSg'
// FEATUREHUB_APP_ENV_URL=http://localhost:8553/features/default/99d8bca3-4e10-4c58-a10c-509b31db3532/X8y3nRMTgtVS7Lsn8Oyk1ppT2Yeap7XGnKVZEjVDMd1XdeqtBAjE6BH4F6f91jXkdh2Sf2zk6PzHJSPa
const featureHubEventSourceClient  = new FeatureHubEventSourceClient(process.env.FEATUREHUB_APP_ENV_URL);
featureHubEventSourceClient.init();
// featureHubRepository.addAnalyticCollector(new GoogleAnalyticsCollector('UA-XXXYYYYY', '1234-5678-abcd-1234'));

featureHubRepository.clientContext
	.country(StrategyAttributeCountryName.NewZealand)
	.device(StrategyAttributeDeviceName.Server)
	.platform(StrategyAttributePlatformName.Macos)
	.build();

const api = restify.createServer();

const cors = corsMiddleware({origins: ['*'], allowHeaders: ['baggage'], exposeHeaders: []});

api.pre(cors.preflight);
api.use(cors.actual);
api.use(restify.plugins.bodyParser());
api.use(restify.plugins.queryParser());
api.use(featurehubMiddleware(featureHubRepository));

const port = process.env.TODO_PORT || 8099 ;

let todos: Todo[] = [];

class TodoController implements ITodoApiController {
	private repo: FeatureHubRepository;

	constructor(repo: FeatureHubRepository) {
		this.repo = repo;
	}

	async resolveTodo(parameters: { id: string }): Promise<Array<Todo>> {
    const todo: Todo = todos.find((todo) => todo.id === parameters.id);
    todo.resolved = true;
    return this.listTodos();
  }

  async removeTodo(parameters: { id: string }): Promise<Array<Todo>> {
    this.repo.logAnalyticsEvent('todo-remove', new Map([['gaValue', '5']]));
    const index: number = todos.findIndex((todo) => todo.id === parameters.id);
    todos.splice(index, 1);
    return this.listTodos();
  }

  async addTodo(parameters: { body?: Todo }): Promise<Array<Todo>> {
	  this.repo.logAnalyticsEvent('todo-add', new Map([['gaValue', '10']]));
    const todo: Todo = {
      id: Math.floor(Math.random() * 20).toString(),
      title: parameters.body.title,
      resolved: false
    };

    todos = [todo, ...todos];
    return this.listTodos();
  }

  private listTodos() : Array<Todo> {
      const newTodoList = [];
      todos.forEach((t) => {
        const newT = new Todo();
        newT.id = t.id;
        newT.resolved = t.resolved;
        newT.title = this.processTitle(t.title);
        newTodoList.push(newT);
      });
      return newTodoList;
  }

  processTitle(title: string) {

    if (this.repo.isSet('FEATURE_STRING') && title == 'buy') {
      title = `${title} ${this.repo.getString('FEATURE_STRING')}`;
      console.log('Processes string feature', title);
    }

    if (this.repo.isSet('FEATURE_NUMBER') && title == 'pay') {
      title = `${title} ${this.repo.getNumber('FEATURE_NUMBER').toString()}`;
      console.log('Processed number feature', title);
    }

    if (this.repo.isSet('FEATURE_JSON') && title == 'find') {
      const json = JSON.parse(this.repo.getJson('FEATURE_JSON'));
      title = `${title} ${json['foo']}`; // expecting {"foo":"bar"}
      console.log('Processed JSON feature', title);
    }

      if (this.repo.getFlag('FEATURE_TITLE_TO_UPPERCASE')) {
        title = title.toUpperCase();
        console.log('Processed boolean feature', title);

    }
    return title;
  }

  async getTodos(parameters: {}): Promise<Array<Todo>> {
    return this.listTodos();
  }

  async removeTodos(parameters: { user: string }): Promise<Array<Todo>> {
    return todos.splice(0, todos.length);
  }
}

const todoRouter = new TodoApiRouter(api, (req: any) => new TodoController(req.featureHub) );

todoRouter.registerRoutes();

process.on('SIGINT', () => { console.log('closing FH client'); api.close(() => featureHubEventSourceClient.close()); });

let initialized = false;
featureHubRepository.addReadynessListener((ready) => {
   if (!initialized) {
  if (ready == Readyness.Ready) {
    console.log("Features are available, starting server...");
      initialized = true;
      api.listen(port, function () {
        console.log('server is listening on port', port);
      });
    }
   }
});
