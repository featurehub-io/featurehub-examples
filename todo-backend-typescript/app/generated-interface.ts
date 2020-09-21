/* tslint:disable:no-string-literal */
/* tslint:disable:member-ordering */
/* tslint:disable:quotemark */
/* tslint:disable:typedef-whitespace */

import {
	Next,
	Request, Response,
	Server
} from "restify";
import * as restify from "restify";

export class Todo {
  'id': string;

  'title': string;

  'resolved': boolean;

}

export interface ITodoApiController {
  resolveTodo(parameters: {
    'id': string,
  }): Promise<Array<Todo>>

  removeTodo(parameters: {
    'id': string,
  }): Promise<Array<Todo>>

  addTodo(parameters: {
    'body'?: Todo,
  }): Promise<Array<Todo>>

  getTodos(parameters: {}): Promise<Array<Todo>>
}

export type ControllerHandler = (req: Request) => ITodoApiController;

export class TodoApiRouter {
  private api: Server;

  private restifyHttpMethods = {
    POST: 'post',
    GET: 'get',
    DELETE: 'del',
    PUT: 'put'
  };

  private controllerFunc: ControllerHandler;

  constructor(api: Server, controllerFunc: ControllerHandler) {
    this.api = api;
    this.controllerFunc = controllerFunc;
  }

  registerRoutes() {
    this.api[this.restifyHttpMethods['PUT']]('/todo/{id}/resolve'.replace(/{(.*?)}/g, ':$1'), (req: restify.Request, res: restify.Response, next: restify.Next) => {
      this.controllerFunc(req).resolveTodo({
        'id': req.params['id'],
      }).then((result) => {
        res.send(result);
        next();
      }).catch(() => {
        res.send(500);
        next();
      });
    });

    this.api[this.restifyHttpMethods['DELETE']]('/todo/{id}/remove'.replace(/{(.*?)}/g, ':$1'), (req: restify.Request, res: restify.Response, next: restify.Next) => {
	    this.controllerFunc(req).removeTodo({
        'id': req.params['id'],
      }).then((result) => {
        res.send(result);
        next();
      }).catch(() => {
        res.send(500);
        next();
      });
    });

    this.api[this.restifyHttpMethods['POST']]('/todo/add'.replace(/{(.*?)}/g, ':$1'), (req: restify.Request, res: restify.Response, next: restify.Next) => {
	    this.controllerFunc(req).addTodo({
        body: req.body,
      }).then((result) => {
        res.send(result);
        next();
      }).catch(() => {
        res.send(500);
        next();
      });
    });

    this.api[this.restifyHttpMethods['GET']]('/todo/list'.replace(/{(.*?)}/g, ':$1'), (req: restify.Request, res: restify.Response, next: restify.Next) => {
	    this.controllerFunc(req).getTodos({}).then((result) => {
        res.send(result);
        next();
      }).catch(() => {
        res.send(500);
        next();
      });
    });

  }

}
