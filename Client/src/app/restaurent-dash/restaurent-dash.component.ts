import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder  } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { RestaurentData } from './restaurent.model';

@Component({
  selector: 'app-restaurent-dash',
  templateUrl: './restaurent-dash.component.html',
  styleUrls: ['./restaurent-dash.component.css'],
  standalone: false
})
export class RestaurentDashComponent implements OnInit {
  formValue!: FormGroup
  restaurentModelObj: RestaurentData = {
    posts: {
      id: '',
      name: '',
      email: '',
      mobile: '',
      address: '',
      services: ''
    }
  };
  allRestaurentData: RestaurentData[] = [];
  showAdd!: boolean;
  showBtn!: boolean;

  constructor(private formbuilder: FormBuilder, private api: ApiService) { }

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      name: [''],
      email: [''],
      mobile: [''],
      address: [''],
      services: ['']
    });
    this.getAllData();
  }

  clickAddResto() {
    this.formValue.reset();
    this.showAdd = true;
    this.showBtn = false;
  }
 
  addRestaurent() {
    const newRestaurant: RestaurentData = {
      posts: {
        id: (Math.floor(Math.random() * 1000)).toString(), // Generate a random ID
        name: this.formValue.value.name,
        email: this.formValue.value.email,
        mobile: this.formValue.value.mobile,
        address: this.formValue.value.address,
        services: this.formValue.value.services
      }
    };

    this.api.postRestaurent(newRestaurant).subscribe({
      next: (res) => {
        console.log(res);
        alert("Restaurant Added Successfully");
        this.formValue.reset();
        
        let ref = document.getElementById('close');
        ref?.click();

        this.getAllData();
      },
      error: (err) => {
        console.error("Error adding restaurant:", err);
        alert("Restaurant Add Failed!");
      }
    });
  }

  getAllData() {
    this.api.getRestaurent().subscribe({
      next: (res: any[]) => {
        // Map to extract posts object
        this.allRestaurentData = res.map(item => item.posts);
      },
      error: (err) => {
        console.error("Error fetching restaurants:", err);
      }
    });
  }

  deleteResto(id: string) {
    this.api.deleteRestaurant(id).subscribe({
      next: (res) => {
        console.log(res);
        alert("Restaurant Deleted Successfully");
        this.getAllData();
      },
      error: (err) => {
        console.error("Error deleting restaurant:", err);
      }
    });
  }

  onEditResto(data: any) {
    this.showAdd = false;
    this.showBtn = true;
    
    // Patch form with the selected restaurant's details
    this.formValue.patchValue({
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      address: data.address,
      services: data.services
    });

    // Store the current restaurant for update
    this.restaurentModelObj = {
      posts: { ...data }
    };
  }

  updateResto() {
    const updateData: RestaurentData = {
      posts: {
        id: this.restaurentModelObj.posts.id,
        name: this.formValue.value.name,
        email: this.formValue.value.email,
        mobile: this.formValue.value.mobile,
        address: this.formValue.value.address,
        services: this.formValue.value.services
      }
    };

    // Use the ID from the original document
    this.api.updateRestaurant(this.restaurentModelObj.posts.id, updateData)
      .subscribe({
        next: (res) => {
          alert("Restaurant Updated Successfully");
          this.formValue.reset();

          let ref = document.getElementById('close');
          ref?.click();

          this.getAllData();
        },
        error: (err) => {
          console.error("Error updating restaurant:", err);
        }
      });
  }
}