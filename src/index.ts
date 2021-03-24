import { StopWatch } from "./stopwatch";
import { Observable } from "rxjs";

const stopwatch = new StopWatch();


var observable = Observable.create((observer:any) => {
  observer.next('Hey guys!');
});

observable.subscribe((x:any) => console.log(x));

function addItem(val:any){
    var node = document.createElement("li");
    var textnode = document.createTextNode(val);
    node.appendChild(textnode);
    document.getElementById("app")?.appendChild(node);
}

