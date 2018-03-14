import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

interface ITodoItem {
  id: number;
  assignedTo?: string;
  description: string;
  done?: boolean;
}
interface IPerson {
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  items: Observable<ITodoItem[]>;
  people: Observable<IPerson[]>;
  userItems: ITodoItem[];
  sortedItems: ITodoItem[];
  newDescription: string;
  username: string;
  dropDownUser: string;
  private httpClient: HttpClient;
  url = 'http://localhost:8080';

  constructor(httpClient: HttpClient) {
    // Test Data:
    this.httpClient = httpClient;
    this.refresh();
  }

  refresh() {
    this.items = this.httpClient.get<ITodoItem[]>(this.url + '/api/todos');
    this.people = this.httpClient.get<IPerson[]>(this.url + '/api/people');
    this.items.subscribe(item => {
      this.userItems=item;
    });
  }

  removeItem(id: number){
    this.httpClient.delete(this.url + '/api/todos');
    this.refresh();
  }

  createItem(event:any){
    if(this.newDescription != ""){
      this.httpClient.post(this.url + '/api/todos', {
        description: this.newDescription,
        assignedTo: this.dropDownUser
      }, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
    }
    this.refresh();
  }

  showUndone(){
    this.sortedItems = this.sortedItems.filter(item=>{
      item.done = false;
    })
  }

  sortUsername(event:any) {
    if(this.username!=""){
      this.sortedItems = this.userItems.filter(item=>{
        item.assignedTo=this.username;
      });
    }else{
      this.sortedItems = this.userItems;
    }
  }
}
