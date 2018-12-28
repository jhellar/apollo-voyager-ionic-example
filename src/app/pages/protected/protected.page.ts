import { Component, Injectable, OnInit } from '@angular/core';
import gql from 'graphql-tag';
import { VoyagerClient } from '@aerogear/datasync-js';
import { VoyagerService } from '../../services/voyager.service';
import { Auth } from '@aerogear/auth';
import { init } from '@aerogear/app';

@Component({
  selector: 'app-protected',
  templateUrl: './protected.page.html',
  styleUrls: ['./protected.page.scss']
})

@Injectable({
  providedIn: 'root'
})
export class ProtectedPage implements OnInit {

  PROTECTED_QUERY = gql`
  query hello {
    hello
  }
`;

  private readonly apollo: VoyagerClient;

  constructor(private aeroGear: VoyagerService) {
    this.apollo = aeroGear.apolloClient;
  }

  ngOnInit(): void {
    const appConfig = require('../../../mobile-services.json');
    init(appConfig);

    const authService = new Auth();

    authService.init({onLoad: 'login-required'})
    .then(() => {
      console.log('successful init & authentication');
    })
    .catch((err) => {
      console.log(err);
    });
  }

  test() {
    this.apollo.query({
      query: this.PROTECTED_QUERY
    })
    .then(result => console.log(result))
    .catch(reason => console.log(reason));
  }

}
