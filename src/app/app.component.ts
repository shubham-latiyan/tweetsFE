import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TweetsService } from './tweets.service';
declare const $: any;
declare const M: any;
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
  loading: Boolean = false;
  user_id: String;
  tweetsArray: Array<any>;
  isEdit: Boolean = false;
  tweetId: any;
  activeEdit: number;
  tweetContent: any;
  searchText: String;
  screen_name: String;
  from: any;
  to: any;

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

    $('#fromDate').datepicker({ maxDate: new Date() }).on('input change', function (e) {
      $('#toDate').val('');
      const date = new Date(e.target.value);
      date.setDate(date.getDate());
      $('#toDate').removeAttr('disabled');
      if ($('#toDate').hasClass('hasDatepicker')) {
        $('#toDate').datepicker('destroy');
      }
      $('#toDate').datepicker({ maxDate: new Date(), minDate: date });
    });
  }


  constructor(private _ts: TweetsService, private _cdr: ChangeDetectorRef) { }

  async handleClick(e) {
    this.loading = true;
    e.preventDefault();
    _window().OAuth.initialize('eTriACS9MK3iG3GjJxEfVvcFJ_I');
    _window().OAuth.popup('twitter').done(async (twitter) => {
      await twitter.me().done((data) => {
        console.log('data:', data)
        this.screen_name = data.alias;
        console.log('screen_name:', this.screen_name)
        if (data.id != null) {
          localStorage.setItem('user_id', data.id)
          this.isLoggedIn = true;
        }
      })
      //  twitter.get('/1.1/account/verify_credentials.json?include_email=true').then(data => {
      //   console.log('self data:', data);
      // })

      await twitter.get(`/1.1/statuses/user_timeline.json?screen_name=${this.screen_name}`).then(data => {
        console.log('data*********:', data);
        if (data.length > 0) {
          this._ts.saveTweets(data).subscribe((data: any) => {
            if (data.success) {
              this.loading = false;
              window.alert("Tweets are fetched from twitter Api and saved to DB")
            }
          })
        }
      })
    })
  }
  getTweets() {
    let id = localStorage.getItem('user_id')
    this._ts.getTweets(id, false).subscribe((data: any) => {
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
    this._ts.editTweet(this.tweetId, this.tweetContent).subscribe((data: any) => {
      if (data.success) {
        this.tweetsArray[index].text = this.tweetContent
        this.activeEdit = Math.random();
      }
    })
  }
  deleteTweet(index, id) {
    this._ts.deleteTweet(id).subscribe((data: any) => {
      if (data.success) {
        this.tweetsArray.splice(index, 1);
        this.activeEdit = Math.random();
      }
    })
  }
  searchTweet() {
    this.from = $('#fromDate').val();
    this.to = $('#toDate').val();
    let id = localStorage.getItem('user_id')
    if (this.from == "") this.from = undefined
    if (this.to == "") this.to = undefined
    this._ts.searchTweet(id, this.searchText, this.from, this.to).subscribe((data: any) => {
      if (data.success) {
        this.tweetsArray = data.data;
      }
    })
  }
  makeFavourite(index, id) {
    this._ts.makeFavourite(id).subscribe((data: any) => {
      if (data.success) {
        this.tweetsArray[index].isFavourite = !this.tweetsArray[index].isFavourite;
      }

    })
  }
  getFavourites() {
    let value = $('#chkval').prop("checked")
    if (value) {
      let id = localStorage.getItem('user_id')
      this._ts.getTweets(id, true).subscribe((data: any) => {
        if (data.success) {
          this.tweetsArray = data.data;
        }
      })
    }
    else if (!value) {
      this.getTweets();
    }
  }
  logOut() {
    this.isLoggedIn = false;
    this.tweetsArray = [];
    if (localStorage.getItem('user_id')) {
      localStorage.removeItem('user_id')
    }
  }
}