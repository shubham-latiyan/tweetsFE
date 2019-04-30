import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TweetsService {

  constructor(private http: HttpClient) { }

  saveTweets(body) {
    console.log('body:', body)
    return this.http.post(environment.API + 'api/tweets', body)
  }
  getTweets(user_id) {
    return this.http.get(environment.API + `api/tweets/${user_id}`)
  }
  editTweet(tweet_id, tweetContent) {
    return this.http.patch(environment.API + `api/tweets/${tweet_id}`, { tweetContent })
  }
  deleteTweet(tweet_id){
    return this.http.delete(environment.API + `api/tweets/${tweet_id}`)
  }
  searchTweet(keyword){
    return this.http.get(environment.API + `api/tweets/search/${keyword}`)
  }
}
