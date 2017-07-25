import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the AboutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  text: number = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  test() {
    this.text++;
    console.log(this.text);
  }
}
