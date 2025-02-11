import { inject, Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { IContact } from '../interfaces/icontact';
import { ITask } from '../interfaces/itask';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firestore: Firestore = inject(Firestore);

  unsubscribeContacts: () => void;
  // contactList: IContact[] = [];
  private contactSubject = new BehaviorSubject<IContact[]>([]);
  contact$ = this.contactSubject.asObservable();

  private taskSubject = new BehaviorSubject<ITask[]>([]);
  task$ = this.taskSubject.asObservable();

  constructor() {
    this.unsubscribeContacts = this.subContactList();

  }



  // subContactList() {
  //   return onSnapshot(this.getColRef("Contacts"), (snapshot) => {
      
  //     snapshot.forEach((doc) => {
  //       this.contactList.push(this.setContactData(doc.data(), doc.id));
  //     });
  //   });
  subContactList() {
    return onSnapshot(this.getColRef("Contacts"), (snapshot) => {
      const updatedContacts: IContact[] = [];
      
      snapshot.forEach((doc) => {
        updatedContacts.push(this.setContactData(doc.data(), doc.id));
      });

      this.contactSubject.next(updatedContacts);
    });
  }

  subTaskList() {
    return onSnapshot(this.getColRef("Tasks"), (snapshot) => {
      const updatedTasks: ITask[] = [];

      snapshot.forEach((doc) => {
        updatedTasks.push(this.setContactData(doc.data(), doc.id));
      });

      this.taskSubject.next(updatedTasks);
    });
  }


  getColRef(colId: string) {
    return collection(this.firestore, colId);
  }

  setContactData(obj: any, id: string): IContact {
    const nameInitials = this.getInitials(obj.name)
    return {
      name: obj.name || "",
      eMail: obj.eMail || "",
      phone: obj.phone || 111,
      initials: nameInitials || "",
      id: id || "",
    }
  }

  getInitials(name: string) {
    if (!name) return "";
    const words = name.trim().split(/\s+/); 
    const initials = words.map(word => word[0].toUpperCase()).join(""); 
    return initials;
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  async getSingleDoc(colId: string, docId: string): Promise<IContact | ITask | null> {
    const docRef = doc(this.firestore, colId, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as IContact | ITask;
    } else {
      console.log("No such document!");
      return null;
    }
  }

  async addToDB(colId: string, item: ITask | IContact) {
    try {
      const docRef = await addDoc(this.getColRef(colId), item);
      console.log("Document written with ID: ", docRef.id);
      
      await this.updateDocWithID(colId, docRef.id);
  
      return docRef.id;
    } catch (err) {
      console.error("Error adding document: ", err);
      return null;
    }
  }

  async updateDocWithID(colId: string, docId: string) {
    const docRef = doc(this.firestore, colId, docId);
    
    try {
      await updateDoc(docRef, { id: docId }); 
      console.log("Document updated with ID field");
    } catch (err) {
      console.error("Error updating document: ", err);
    }
  }

  async updateDoc(colId:string, docId: string, updatedData: Partial<IContact | ITask>): Promise<void> {
    const DocRef = doc(this.firestore, colId, docId);

    try {
      await updateDoc(DocRef, updatedData);
      console.log(`Document ${docId} successfully updated.`);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  async deleteUser(colId: string, docId:string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
      (err) => (console.log(err))
    );
  }

  ngOnDestroy() {
    if(this.unsubscribeContacts) {
      this.unsubscribeContacts();
    }
  }
}
