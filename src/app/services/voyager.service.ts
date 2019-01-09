import { createClient, VoyagerClient, OfflineQueueListener } from '@aerogear/datasync-js';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Service provides Apollo Voyager client
 */
export class VoyagerService {

  private _apolloClient: VoyagerClient;
  private listener: OfflineQueueListener;
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  set queueListener(listener: OfflineQueueListener) {
    this.listener = listener;
  }

  get apolloClient(): VoyagerClient {
    return this._apolloClient;
  }

  public async createApolloClient() {
    const self = this;
    // Provides basic info about the offline queue
    const numberOfOperationsProvider: OfflineQueueListener = {
      onOperationEnqueued(operation) {
        if (self.listener) {
          self.listener.onOperationEnqueued(operation);
        }
      },

      queueCleared() {
        if (self.listener) {
          self.listener.queueCleared();
        }
      }
    };
    const uri = 'http://localhost:4000/graphql';
    const wsUri = 'ws://localhost:4000/graphql';

    return await this.authService.init()
      .then(async () => {
        console.log('successful init & authentication');
        return this._apolloClient = await createClient({
          httpUrl: uri,
          wsUrl: wsUri,
          offlineQueueListener: numberOfOperationsProvider,
          headerProvider: {
            getHeaders: () => {
              if (this.authService.getBearerToken()) {
                return {
                  Authorization: 'Bearer ' + this.authService.getBearerToken()
                };
              } else {
                return {};
              }
            }
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

}
