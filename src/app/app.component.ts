import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TweetsService } from './tweets.service';
declare const $: any;
function _window(): any {
  return window;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn: Boolean = false;
  user_id: String;
  tweetsArray: Array<any>;
  isEdit: Boolean = false;
  tweetId: any;
  activeEdit: number;
  tweetContent: any;
  searchText: String;

  ngOnInit() {
    const oauthScript = document.createElement('script');
    oauthScript.src = 'https://cdn.rawgit.com/oauth-io/oauth-js/c5af4519/dist/oauth.js';
    document.body.appendChild(oauthScript);
  }
  ngAfterViewInit() {
    if (localStorage.getItem('user_id')) {
      this.isLoggedIn = true;
    }
    else {
      this.isLoggedIn = false;
    }
    this._cdr.detectChanges();
  }


  constructor(private _ts: TweetsService, private _cdr: ChangeDetectorRef) { }

  handleClick(e) {
    e.preventDefault();
    _window().OAuth.initialize('eTriACS9MK3iG3GjJxEfVvcFJ_I');
    _window().OAuth.popup('twitter').done((twitter) => {
      // console.log(twitter)
      twitter.me().done((data) => {
        if (data.id != null) {
          localStorage.setItem('user_id', data.id)
        }
        console.log('data:', data)
      })
      // twitter.get('/1.1/account/verify_credentials.json?include_email=true').then(data => {
      //   // console.log('self data:', data);
      // })

      twitter.get('/1.1/statuses/user_timeline.json?screen_name=Shubhamlatiyan').then(data => {
        console.log('data*********:', data);
        if (data.length > 0) {

        }
        // this._ts.saveTweets(data).subscribe((data) => {
        //   console.log('data:', data)

        // })
      })
    })
  }
  getTweets() {
    let id = localStorage.getItem('user_id')
    this._ts.getTweets(id).subscribe((data: any) => {
      console.log('data:', data)
      this.tweetsArray = data.data;
    })
  }
  editTweet(index, _id, val) {
    this.isEdit = true;
    this.tweetId = _id;
    this.activeEdit = index;
    this.tweetContent = val;

  }
  saveTweet(index) {
    this._ts.editTweet(this.tweetId, this.tweetContent).subscribe((data) => {
      console.log('EDDDDDdata:', data)
    })
    this.tweetsArray[index].text = this.tweetContent
    this.activeEdit = Math.random();
  }
  deleteTweet(index, id) {
    this._ts.deleteTweet(id).subscribe((data) => {
    })
    this.tweetsArray.splice(index, 1);
    this.activeEdit = Math.random();
  }
  searchTweet(){
    this._ts.searchTweet(this.searchText).subscribe((data: any)=>{
      console.log('searchhh:', data)
      if(data.success){
        this.tweetsArray = data.data;
      }

    })
  }
  logOut() {
    if (localStorage.getItem('user_id')) {
      localStorage.removeItem('user_id')
    }
  }




}