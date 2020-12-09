import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor(
    public loadingController: LoadingController
  ) { }

  showHideAutoLoader() {
    this.loadingController.create({
      spinner: null,
      message: `
        <div>
          <img src="../../assets/images/loading.gif" alt="loader">
        </div>
      `,
      duration: 2500
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        console.log('Loading dismissed! after 2 Seconds', dis);
      });
    });
  }
}
