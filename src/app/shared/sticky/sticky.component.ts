import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StickyService } from '../../services/sticky.service';
import { FlashMessagesService } from 'angular2-flash-messages/module/flash-messages.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Sticky } from './../../models/sticky.model';

@Component({
  selector: 'app-sticky',
  templateUrl: './sticky.component.html',
  styleUrls: ['./sticky.component.css']
})
export class StickyComponent implements OnInit, OnDestroy {
  @Input() cardType;
  @Input() sticky;
  @Input() canReserve;
  @Output() stickyDeleted = new EventEmitter<boolean>();
  @Output() stickyReserved = new EventEmitter<boolean>();
  isLoggedIn = false;
  reserveMode = false;
  editMode = false;
  errorMode = false;
  errorMessage = '';
  deletePrompt = false;

  stickySub: Subscription;

  reserveForm: FormGroup;
  editForm: FormGroup;

  constructor(private userService: UserService, 
    private stickyService: StickyService,
    private flashMessagesService: FlashMessagesService,
    private router: Router) { }

  ngOnInit() {
    // get Logged In status
    this.isLoggedIn = this.userService.isAuthenticated();
    // set up reactive Form
    this.reserveForm = new FormGroup({
      'reserveBy': new FormControl(null, Validators.required)
    });
    // set up reactive Form
    this.editForm = new FormGroup({
      'title': new FormControl(this.sticky.title, Validators.required),
      'message': new FormControl(this.sticky.message, Validators.required),
      'from': new FormControl(this.sticky.from, Validators.required)
    });

    // check whether public (not logged in) can or cannot reserve anymore stickies
    // this.setCanReserve();
    // console.log('init', this.canReserve);
  }

//  R E S E R V E 
  onReserveShow() {
    this.reserveMode = true;
    this.editMode = false;
    this.errorMode = false;
  }
  // setCanReserve() {
  //   if (!this.isLoggedIn) {
  //     const lsStickyId = (localStorage.getItem('reserved_id')) ? localStorage.getItem('reserved_id') : null;
  //     if (lsStickyId === null) {
  //       this.canReserve = true;
  //     } else {
  //       this.canReserve = false;
  //     }
  //   }
  // }
  // canReserveCheck() {
  //   // reverse logic needed for disabled button
  //   return !this.canReserve;
  // }
  // change reserve sticky from db & frontend sticky list
  onReserveSet() {
    //validate
    if (this.reserveForm.status !== 'INVALID') {
      
      const id = this.sticky._id;
      // update sticky on frontend & backend
      const name = this.reserveForm.controls['reserveBy'].value;      
      this.stickyService.reserve(id, name).subscribe(
        sticky => {
          const stickyList = this.stickyService.getStickies();
          stickyList.forEach(stickyItem => {
            if (stickyItem._id === id) {
              stickyItem.reserved = true;
              stickyItem.reservedBy = name;
            }            
          });
          
          if (this.isLoggedIn) {
            this.flashMessagesService.show('Sticky Reserved Successfully!', {cssClass:'alert alert-success', timeout:2000})

            // navigate away
            setTimeout(() => {
              this.router.navigate(['/dashboard/reserved']);
  
            }, 2500);
          } else {
            this.flashMessagesService.show(`Sticky Reserved! Now, go Redeem it at ${this.sticky.user.name} !`,
                                     {cssClass: 'alert alert-success', timeout: 3500})

            // restrict reserving to one item until it's redeemed
              // save sticky id in localStorage
              localStorage.setItem('reserved_id', this.sticky._id);
              // this.setCanReserve();
              // console.log('reserved button clicked', this.canReserve);
            //emit to homepage of new sticky array
            setTimeout(() => {
              this.stickyReserved.emit(true);
            }, 4000);
          }
        },
        error => {
          const stickyList = this.stickyService.getStickies();
          stickyList.forEach(stickyItem => {
            if (stickyItem._id === this.sticky._id) {
              stickyItem.reserved = false;
              stickyItem.reservedBy = '';
            }
          });          
          // flash message
          this.errorMode = true;
          this.errorMessage = 'Sorry could not reserve at this time. Try another item.';
          this.flashMessagesService.show(this.errorMessage, {cssClass: 'alert alert-danger', timeout: 5000});
          // navigate away
          this.router.navigate(['/dashboard']);
        }
      );      
    }
  }  

  onUnreserveSet() {
    this.stickyService.reserve(this.sticky._id, 'xunreservex').subscribe(
      sticky => {
        const stickyList = this.stickyService.getStickies();
        stickyList.forEach(stickyItem => {
          if (stickyItem._id === this.sticky._id) {
            stickyItem.reserved = false;
            stickyItem.reservedBy = '';
          }
        }); 
        // navigate away
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 600);
      },
      error => {
        this.flashMessagesService.show(this.errorMessage, {cssClass: 'alert alert-danger', timeout: 5000});
      }
    );
  }

// E D I T 
  onEditShow() {
    this.editMode = true;
    this.reserveMode = false;
    this.errorMode = false;
    
  }

  onEditSet() {
    if (this.editForm.status !== 'INVALID') {
      // update on the frontend
        // find sticky on array
      const stickyList = this.stickyService.getStickies();
      stickyList.forEach(stickyItem => {
        if (stickyItem._id === this.sticky._id) {
          stickyItem.title = this.editForm.controls['title'].value;
          stickyItem.message = this.editForm.controls['message'].value;
          stickyItem.from = this.editForm.controls['from'].value;
        }
      });

      // update on the backend
      const tempSticky = new Sticky(
        this.editForm.controls['title'].value,
        this.editForm.controls['message'].value,
        this.editForm.controls['from'].value
      );
      
      this.stickyService.edit(this.sticky._id, tempSticky).subscribe(
        (sticky) => {          
          this.flashMessagesService.show('Edit Successfull', {cssClass: 'alert alert-success', timeOut: 2000});
          setTimeout( () => {
            this.editMode = false;
          }, 2500);
        },
        (error) => {
          this.flashMessagesService.show('Could Not Edit at this time.', {cssClass: 'alert alert-danger', timeOut: 2000});

        }
      );
    }

  }

  
// R E D E E M
  onRedeemSet(){
    this.stickyService.redeem(this.sticky._id).subscribe(
      sticky => {
        this.flashMessagesService.show('Reserved Successfull', {cssClass: 'alert alert-success', timeOut: 2000});

          // navigate to list of redeemed
          this.router.navigate(['dashboard/redeemed']);
      },
      error => {
        // revert the sticky back
        const stickyList = this.stickyService.getStickies();
        stickyList.forEach(stickyItem => {
          if (stickyItem._id === this.sticky._id) {
            stickyItem.redeemed = false;
            stickyItem.redeemedDate = null;
          }
        });
      }
    );
  }
  
// D E L E T E 
  onDeletePrompt() {
    // show a propmt on sticky with option of yes or no - for deleting sticky
    this.deletePrompt = true;
  }

  onDeleteSet() {
    // Do the actual Deleting - if yes on prompt
    console.log('set');
    this.stickyService.delete(this.sticky._id).subscribe(
      sticky => {
        if (this.cardType === 'redeemed') {
          this.router.navigate(['/dashboard']);
        }

        if (this.cardType === 'available') {
          // emit event to parent component to update stickies
          this.stickyDeleted.emit(true);
        }

      },
      error => {

      }
    );
  }

  onDeleteCancel() {
    // Cancel deleting - if no on prompt
    console.log('cancel');
    this.deletePrompt = false;
  }

// Cancel
  onReserveEditModeCancel() {
    this.reserveMode = false;
    this.editMode = false;
    this.errorMode = false;
  }

  ngOnDestroy() {

  }

}
