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
  getTweets(user_id, value) {
    return this.http.get(environment.API + `api/tweets/${user_id}/${value}`)
  }
  editTweet(tweet_id, tweetContent) {
    return this.http.patch(environment.API + `api/tweets/edit/${tweet_id}`, { tweetContent })
  }
  deleteTweet(tweet_id){
    return this.http.delete(environment.API + `api/tweets/${tweet_id}`)
  }
  searchTweet(keyword, from, to){
    return this.http.get(environment.API + `api/tweets/search/${keyword}/filter/${from}/${to}`)
  }
  makeFavourite(id){
    return this.http.post(environment.API + `api/tweets/favourite`, {id})
  }
}
