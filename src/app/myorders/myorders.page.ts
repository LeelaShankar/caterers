import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.page.html',
  styleUrls: ['./myorders.page.scss'],
})
export class MyordersPage implements OnInit {
  days: Array<any> = [];
  dates: Array<any> = [];
  dailyTrans: Array<any> = [];
  showCalendar: boolean = false;
  showChefs: boolean = true;
  showChefData: boolean = false;
  customerName: string;
  selectedSlot: string = '';
  confirmCheforders: Array<any> = [];
  checkedSegment: string = 'confirmed';
  requestChefOrders: Array<any> = [];
  timeSlot: any;
  inactiveOrders: Array<any> = [];
  isToday: string;
  static clickedDate: any;
  chefStatus: any;
  bulkOrders: any;
  orderClicked: boolean = false
  selectedmenu: any;
  menuStatus: any;
  constructor(public router: Router, public alert: AlertController, public http: HttpClient) { }

  /**
   * 
   * @param dailyTrans Processing the dates from daily transactions array 
   * @param id order id 
   */

  processDates(dailyTrans, id) {
    let colVals = {};
    // let self = 
    let splittedString: string;
    if (dailyTrans.length > 0) {
      this.days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      let filDates;
      if (this.dates.length == 0) {
        let day = dailyTrans[0].deliveryDate.split(" ")[0];
        let idx = this.days.indexOf(day)
        filDates = dailyTrans.splice(0, 7 - idx)
      }
      else {
        filDates = dailyTrans.splice(0, 7)
      }
      filDates.map(x => {
        if (x.deliveryDate) {
          splittedString = x.deliveryDate.split(" ")
          colVals[splittedString[0]] = { Date: splittedString[2], Month: splittedString[1], Year: splittedString[3], order: x, orderId: id, chefStatus: x.status }
        }
      })
      this.dates.push(colVals);
      this.processDates(dailyTrans, id);
    }
    else {
      console.log('do nothingggg')
    }
    console.log('datesssssssss', this.dates)
  }

  ngOnInit() { }


  /**
   * 
   * @param order getting the customer chef order for that particular chef
   */

  chefClicked(order) {
    let self = this;
    let url: string = 'customercheforder/' + order._id;
    this.days.splice(0);
    this.dates.splice(0);
    // this.service.getCustomerChefOrder(url).subscribe((res: any) => {
    //   let orderData = res.orderData[0]
    //   console.log('orderdataaa', orderData)
    //   let dailyTrans = (orderData && orderData.dailyTransactions) || [];
    //   self.customerName = orderData.customerName || localStorage.getItem('firstName') + " " + localStorage.getItem('lastName');
    //   self.timeSlot = orderData.slotTimings[0].slotTimings
    //   dailyTrans.map((x: any) => {
    //     if (x.date) x.date = new Date(x.date).toDateString()
    //   })
    //   this.processDates(dailyTrans, orderData._id)
    //   this.showChefData = false;
    //   // this.showCalendar = false;
    //   // this.showChefs = true;
    //   this.showChefs = false;
    //   this.showCalendar = true;
    // })
    // this.showChefs = false;
    // this.showCalendar = true;
  }

  ionViewWillEnter() {
    let self = this;


    this.http.get('http://139.59.95.63:3000/api/homekitchenbulk/customerorders/' + localStorage.getItem('customerId')).subscribe((res: any) => {
      console.log('ressss', res)
      self.bulkOrders = res.customerBulkOrders

    })
  }


  /**
   * getting customer chef orders and filtering those into confirmed and requested 
   */
  getChefOrders() {
    let self = this;
    let url = 'customercheforder/getcheforders/' + localStorage.getItem('chefId')
    // this.service.getChefOrders(url).subscribe((res: any) => {
    //   console.log('resss', res);
    //   self.confirmCheforders.splice(0);
    //   self.requestChefOrders.splice(0);
    //   self.inactiveOrders.splice(0);
    //   self.confirmCheforders = res.activeChefOrders.filter((x: any) => x.bookingStatus == "Confirmed")
    //   self.requestChefOrders = res.activeChefOrders.filter((x: any) => x.bookingStatus == 'Requested');
    //   self.inactiveOrders = res.inActiveChefOrders || [];
    // })
  }

  /**
   * 
   * @param date showing the transaction details for that particular date
   */

  showDetails(date, totalDate) {
    console.log('dateeeee', date, 'totaldateee', totalDate)
    this.selectedmenu = date.order.selectedmenus;
    this.menuStatus = date.order.status
    this.showChefData = true

    this.isToday = this.getClass(date);

  }
  /**
   * 
   * @param date setting the class for that particular date enables color and disablity for each date
   */

  getClass(date) {
    let slot = date.Date + " " + date.Month + " " + date.Year;
    let momentDate = moment(slot, 'DD MMM YYYY');
    if (momentDate > moment()) {
      return 'otherDate';
    }
    else if (momentDate.isSame(moment(), 'date') && momentDate.isSame(moment(), 'month'))
      return 'currentDate';
    else {
      return 'previousDate';
    }
  }



  backButtonClicked() {
    this.showCalendar = false;
    this.showChefs = true;
    this.showChefData = false;
    this.orderClicked = false
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login'])
  }

  /**
   *  
   */

  applyLeave() {
    console.log('dateee', MyordersPage.clickedDate)
    let params: any = {};
    params.orderId = MyordersPage.clickedDate.orderId;
    params.transactionId = MyordersPage.clickedDate.transactionId;
    params.chefId = localStorage.getItem('chefId')
    let url = 'customercheforder/updateleavebychef'
    // this.service.updateLeave(url, params).subscribe(res => {
    //   console.log('ress', res)

    // })
  }

  revokeLeave() {
    console.log('dateee', MyordersPage.clickedDate);
    let params: any = {};
    params.orderId = MyordersPage.clickedDate.orderId;
    params.transactionId = MyordersPage.clickedDate.transactionId;
    params.chefId = localStorage.getItem('chefId')
    let url = 'customercheforder/revokeleavebychef'
    // this.service.revokeLeave(url, params).subscribe(res => {
    //   console.log('ress', res)
    // })
  }

  /**
   * 
   * @param status update the booking status for that particular order 
   * @param order contains orderid for that order
   */

  updateStatus(status, order) {
    let self = this;
    console.log('in update status', status);
    let params: any = {};
    params.chefId = localStorage.getItem('chefId');
    params.orderId = order._id;
    params.bookingstatus = status;
    let url = 'customercheforder/updatestatus';
    // this.service.updateStatus(url, params).subscribe((res: any) => {
    //   console.log('resssssss', res)
    //   self.getChefOrders()
    //   res.header = 'Success'
    //   self.openAlert(res)
    // }, err => {
    //   err.header = 'Error';
    //   self.openAlert(err)
    // })
  }

  /**
   * 
   * @param order 
   */

  openCalendar(order) {
    let self = this;
    console.log('orderrr', order);
    this.http.get('http://139.59.95.63:3000/api/homekitchenbulk/' + order._id).subscribe((res: any) => {
      console.log('ress', res);
      let packageDetail = res.kitchenBulkOrder[0].packageDetail[0].selectedpackageitems;
      packageDetail.map(x => {
        if (x.deliveryDate) x.deliveryDate = new Date(x.deliveryDate).toDateString() //moment(x.deliveryDate, 'YYYY-MM-DD')['_d']
      })
      console.log('packagedetailll', packageDetail);
      this.dates.splice(0)
      self.processDates(packageDetail, order._id)
      self.orderClicked = true;
      self.showCalendar = true
    })
  }


  /**
   * 
   * @param res opening an alert based on the res value
   */

  async openAlert(res) {
    let alert = await this.alert.create({
      header: res.header,
      message: res.message,
      buttons: [{
        text: 'Ok'
      }],
      backdropDismiss: false
    })
    alert.present()
  }

}
