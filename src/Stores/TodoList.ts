import { action, observable } from "mobx";
import { Client, Config, BaseConfig } from "@textile/threads-client";
import queryString from "query-string";
import TodoItem, { TodoType } from "./TodoItem";

export class TodoList {
  private client: Client;
  private listID: string = "";
  user: string = '';

  @observable.shallow list: TodoItem[] = [];

  constructor(todos: string[], config: Config | BaseConfig) {




    console.log(config, 'config')
    todos.forEach(this.addTodo);
    this.client = new Client(config);
    const parsed = queryString.parse(window.location.search);
    if (parsed.id) {
      this.listID = parsed.id.toString();


      this.client.listen(this.listID, "Todo", 'any', (entity: any, error: any) => {
        console.log(error);
        console.log(entity, 'entity');
        entity && this.loadList();
      })

      this.loadList();
      return
    }

    let id = '6daba587-2abe-4586-b570-1a5850a16f12'

    let linkArray = [
      {
        "address": "/ip4/127.0.0.1/tcp/4006/p2p/12D3KooWFSqRCUdV6J8De5PzspT8vwQcZNYvkNZ2P14Hzk8792p1/thread/bafk6blr7go7q7pa2fgvmhdosystt5l4c3o4vpkexnz7s6frzqtbrdbi",
        "followKey": "AqJXmAigYaKgiAFR6kNufHMyVU57ADovHSZgUkwF71ejw274pSf1vGKsAibf",
        "readKey": "2BNiE45Q1os81TMzhNBDhJquscjug93MnMSq3X2gyGkPytc6vahuaSPTsZZm5"
      },
      {
        "address": "/ip4/172.31.0.2/tcp/4006/p2p/12D3KooWFSqRCUdV6J8De5PzspT8vwQcZNYvkNZ2P14Hzk8792p1/thread/bafk6blr7go7q7pa2fgvmhdosystt5l4c3o4vpkexnz7s6frzqtbrdbi",
        "followKey": "AqJXmAigYaKgiAFR6kNufHMyVU57ADovHSZgUkwF71ejw274pSf1vGKsAibf",
        "readKey": "2BNiE45Q1os81TMzhNBDhJquscjug93MnMSq3X2gyGkPytc6vahuaSPTsZZm5"
      },
      {
        "address": "/ip4/104.210.43.77/tcp/4006/p2p/12D3KooWFSqRCUdV6J8De5PzspT8vwQcZNYvkNZ2P14Hzk8792p1/thread/bafk6blr7go7q7pa2fgvmhdosystt5l4c3o4vpkexnz7s6frzqtbrdbi",
        "followKey": "AqJXmAigYaKgiAFR6kNufHMyVU57ADovHSZgUkwF71ejw274pSf1vGKsAibf",
        "readKey": "2BNiE45Q1os81TMzhNBDhJquscjug93MnMSq3X2gyGkPytc6vahuaSPTsZZm5"
      },
      {
        "address": "/ip4/104.210.43.77/tcp/10733/p2p/12D3KooWFSqRCUdV6J8De5PzspT8vwQcZNYvkNZ2P14Hzk8792p1/thread/bafk6blr7go7q7pa2fgvmhdosystt5l4c3o4vpkexnz7s6frzqtbrdbi",
        "followKey": "AqJXmAigYaKgiAFR6kNufHMyVU57ADovHSZgUkwF71ejw274pSf1vGKsAibf",
        "readKey": "2BNiE45Q1os81TMzhNBDhJquscjug93MnMSq3X2gyGkPytc6vahuaSPTsZZm5"
      },
      {
        "address": "/ip4/10.255.0.2/tcp/10733/p2p/12D3KooWFSqRCUdV6J8De5PzspT8vwQcZNYvkNZ2P14Hzk8792p1/thread/bafk6blr7go7q7pa2fgvmhdosystt5l4c3o4vpkexnz7s6frzqtbrdbi",
        "followKey": "AqJXmAigYaKgiAFR6kNufHMyVU57ADovHSZgUkwF71ejw274pSf1vGKsAibf",
        "readKey": "2BNiE45Q1os81TMzhNBDhJquscjug93MnMSq3X2gyGkPytc6vahuaSPTsZZm5"
      }
    ];




    this.client.startFromAddress(id, linkArray[0].address, linkArray[0].followKey, linkArray[0].readKey).then(() => {
      this.listID = id;
      const query = { ...parsed, id: id };
      console.log(query, 'query')

      //    this.client.listen(store.id, "Todo"  )

      window.location.search = queryString.stringify(query);
    });


  };

  @action
  loadList = async () => {

    const parsed = queryString.parse(window.location.search);
    let user: string = parsed?.user?.toString() || '';
    const found = await this.client.modelFind(this.listID, 'Todo', {});
    console.log(this.listID, 'Todo', {}, found, user)

    this.list = found.entitiesList.map((entity: any) => entity).map((obj: any) => {
      return new TodoItem(obj);
    });

    let link = await this.client.getStoreLink(this.listID);
    console.log('link', link)
  };

  @action
  updateTodo = async (todo: TodoItem) => {
    await this.client.modelSave(this.listID, "Todo", [todo])
    const index = this.list.findIndex(item => item.ID === todo.ID);
    this.list.splice(index, 1, todo);
  }

  @action
  addTodo = async (text: string) => {
    const todo: TodoType = { ID: "", text, isDone: false };
    const created = await this.client.modelCreate(this.listID, 'Todo', [todo])
    const todos = created.entitiesList
    this.list.unshift(new TodoItem(todos.pop()));
  };

  @action
  removeTodo = async (todo: TodoItem) => {
    await this.client.modelDelete(this.listID, "Todo", [todo.ID]);
    const index = this.list.findIndex(item => item.ID === todo.ID);
    this.list.splice(index, 1);
  };
}

const schema = {
  $id: "https://example.com/person.schema.json",
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Todo",
  type: "object",
  properties: {
    ID: {
      type: "string",
      description: "The item id."
    },
    text: {
      type: "string",
      description: "The todo text."
    },
    idDone: {
      description: "Whether the item is done.",
      type: "boolean"
    }
  }
};
