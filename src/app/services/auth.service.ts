import { createClient, VoyagerClient, OfflineQueueListener } from '@aerogear/datasync-js';
import { Injectable } from '@angular/core';
import {init} from '@aerogear/app';
import {Auth} from '@aerogear/auth';

@Injectable({
    providedIn: 'root'
})
/**
 * Service handles authentication
 */
export class AuthService {

  private auth: Auth;

  constructor() {
  }

  init() {
    const appConfig = require('../../mobile-services.json');
    init(appConfig);

    this.auth = new Auth();

    return this.auth.init({onLoad: 'login-required'})
      .then(() => {
        this.auth.extract().updateToken(100000);
      });
  }

  getBearerToken() {
    if (this.auth.isAuthenticated()) {
      return this.auth.extract().token;
    }
    return undefined;
  }
}
