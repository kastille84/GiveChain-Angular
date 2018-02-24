import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StickyService } from '../../services/sticky.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;

  constructor(private stickyService: StickyService) { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      'search': new FormControl(null)
    });
  }

  onSearch() {
    if (this.searchForm.status === 'VALID') {
      const city = localStorage.getItem('city');
      const state = localStorage.getItem('state');
      const search = this.searchForm.controls['search'].value;
      this.stickyService.retrieveFromServer(city, state, search)
    }
  }

}
