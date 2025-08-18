
import { db } from './firebase';
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  query,
  where,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import type { Company, Contact, Deal, Product, Task, Note, Stage } from '@/types';
import { mockCompanies, mockContacts, mockDeals, mockProducts } from '@/data/mock-data';

// Generic CRUD Functions
const getCollection = async <T>(collectionName: string): Promise<T[]> => {
  const q = collection(db, collectionName);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as T));
};

const getDocument = async <T>(collectionName: string, id: string): Promise<T | null> => {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { ...docSnap.data(), id: docSnap.id } as T;
    }
    return null;
}

const addDocument = async <T extends { id?: string }>(collectionName: string, data: Omit<T, 'id'>): Promise<T> => {
  const docRef = await addDoc(collection(db, collectionName), data);
  return { ...data, id: docRef.id } as T;
};

const updateDocument = async <T extends { id?: string }>(collectionName: string, id: string, data: Partial<Omit<T, 'id'>>): Promise<void> => {
  await updateDoc(doc(db, collectionName, id), data);
};

const deleteDocument = async (collectionName: string, id: string): Promise<void> => {
  await deleteDoc(doc(db, collectionName, id));
};


// Specific Functions
export const getCompanies = () => getCollection<Company>('companies');
export const getCompany = (id: string) => getDocument<Company>('companies', id);
export const addCompany = (data: Omit<Company, 'id'>) => addDocument<Company>('companies', data);
export const updateCompany = (id: string, data: Partial<Company>) => updateDocument<Company>('companies', id, data);
export const deleteCompany = (id: string) => deleteDocument('companies', id);

export const getContacts = () => getCollection<Contact>('contacts');
export const getContact = (id: string) => getDocument<Contact>('contacts', id);
export const getContactsByCompany = async (companyId: string): Promise<Contact[]> => {
    const q = query(collection(db, 'contacts'), where('companyId', '==', companyId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Contact));
}
export const addContact = (data: Omit<Contact, 'id'>) => addDocument<Contact>('contacts', data);
export const updateContact = (id: string, data: Partial<Contact>) => updateDocument<Contact>('contacts', id, data);
export const deleteContact = (id: string) => deleteDocument('contacts', id);

export const getProducts = () => getCollection<Product>('products');
export const getProduct = (id: string) => getDocument<Product>('products', id);
export const addProduct = (data: Omit<Product, 'id'>) => addDocument<Product>('products', data);
export const updateProduct = (id: string, data: Partial<Product>) => updateDocument<Product>('products', id, data);
export const deleteProduct = (id: string) => deleteDocument('products', id);

export const getDeals = () => getCollection<Deal>('deals');
export const getDeal = (id: string) => getDocument<Deal>('deals', id);
export const addDeal = (data: Omit<Deal, 'id'>) => addDocument<Deal>('deals', { ...data, tasks: [], notes: [], contactHistory: []});
export const updateDeal = (id: string, data: Partial<Deal>) => updateDocument<Deal>('deals', id, data);
export const updateDealStage = (id: string, stage: Stage) => updateDocument<Deal>('deals', id, { stage, contactHistory: [...(getDeal(id) as any).contactHistory, `Card movido para ${stage} em ${new Date().toLocaleDateString('pt-BR')}`] });
export const deleteDeal = (id: string) => deleteDocument('deals', id);


// Tasks are a subcollection of deals
export const getTasks = (dealId: string) => getCollection<Task>(`deals/${dealId}/tasks`);
export const addTask = (dealId: string, data: Omit<Task, 'id'>) => addDocument<Task>(`deals/${dealId}/tasks`, {...data, dueDate: data.dueDate ? Timestamp.fromDate(new Date(data.dueDate)) : undefined});
export const updateTask = (dealId: string, taskId: string, data: Partial<Task>) => updateDocument<Task>(`deals/${dealId}/tasks`, taskId, {...data, dueDate: data.dueDate ? Timestamp.fromDate(new Date(data.dueDate)) : undefined});
export const deleteTask = (dealId: string, taskId: string) => deleteDocument(`deals/${dealId}/tasks`, taskId);

// Notes are a subcollection of deals
export const getNotes = (dealId: string) => getCollection<Note>(`deals/${dealId}/notes`);
export const addNote = (dealId: string, data: Omit<Note, 'id'>) => addDocument<Note>(`deals/${dealId}/notes`, {...data, createdAt: Timestamp.fromDate(new Date())});
export const updateNote = (dealId: string, noteId: string, data: Partial<Note>) => updateDocument<Note>(`deals/${dealId}/notes`, noteId, data);
export const deleteNote = (dealId: string, noteId: string) => deleteDocument(`deals/${dealId}/notes`, noteId);


// --- Seeding ---
// Check if data exists
const isCollectionEmpty = async (collectionName: string) => {
    const q = query(collection(db, collectionName));
    const snapshot = await getDocs(q);
    return snapshot.empty;
};

// Seed all data
export const seedDatabase = async () => {
    const batch = writeBatch(db);

    if (await isCollectionEmpty('companies')) {
        console.log("Seeding companies...");
        mockCompanies.forEach(company => {
            const docRef = doc(db, 'companies', company.id);
            batch.set(docRef, company);
        });
    }

    if (await isCollectionEmpty('contacts')) {
        console.log("Seeding contacts...");
        mockContacts.forEach(contact => {
            const docRef = doc(db, 'contacts', contact.id);
            batch.set(docRef, contact);
        });
    }

    if (await isCollectionEmpty('products')) {
         console.log("Seeding products...");
        mockProducts.forEach(product => {
            const docRef = doc(db, 'products', product.id);
            batch.set(docRef, product);
        });
    }
    
    if (await isCollectionEmpty('deals')) {
        console.log("Seeding deals...");
        mockDeals.forEach(deal => {
            const { tasks, notes, ...dealData } = deal;
            const dealDocRef = doc(db, 'deals', deal.id);
            batch.set(dealDocRef, dealData);
            
            tasks?.forEach(task => {
                const taskDocRef = doc(db, `deals/${deal.id}/tasks`, task.id);
                batch.set(taskDocRef, task);
            });

            notes?.forEach(note => {
                const noteDocRef = doc(db, `deals/${deal.id}/notes`, note.id);
                batch.set(noteDocRef, note);
            });
        });
    }

    await batch.commit();
    console.log("Database seeded successfully!");
};
