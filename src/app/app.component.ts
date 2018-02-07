import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  username="";
  message="";
  receiveMessage=[];
  socket;
  setCookie(c_name,value,expiredays) {
    var exp = new Date();
    exp.setTime(exp.getTime() + expiredays*24*60*60*1000);
    document.cookie = c_name + "="+ value + ";expires=" + exp.toUTCString();
  }
  getCookie(c_name){
     if (document.cookie.length>0){
        let c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1){ 
           c_start=c_start + c_name.length+1 
           let c_end=document.cookie.indexOf(";",c_start)
           if (c_end==-1) c_end=document.cookie.length
              return document.cookie.substring(c_start,c_end);
        }  
     }
     return ""
  }
  submit(){
    this.receiveMessage.push({className:"myself",text:this.message,from:this.username});
    this.socket.emit('sendMessage',{text:this.message,from:this.username,to:this.to});
  }
  ngOnInit(){
    const _self=this;
    this.username=this.getCookie("username");
    if(this.username==""){
      this.username = +new Date();
      this.setCookie("username",this.username,1);
    }
    this.socket= io.connect('http://127.0.0.1:3000');
    this.socket.emit("addUser",{username:this.username});
    this.socket.on('getMessage',function(data){
         console.log("someone call you")
         _self.receiveMessage.push({className:"other",text:data.text,from:data.from.slice(-3)});    
    })
    this.socket.emit("addUser",{username:this.username});
  }
}

