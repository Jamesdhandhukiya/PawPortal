// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    setDoc, 
    getDocs, 
    doc, 
    deleteDoc,
    Timestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA3F3X1WWgIP9rxFiroRqPKUE6PzQ5wYxw",
    authDomain: "paw-portal.firebaseapp.com",
    projectId: "paw-portal",
    storageBucket: "paw-portal.firebasestorage.app",
    messagingSenderId: "1092693026291",
    appId: "1:1092693026291:web:e345189aa9a3a7439f9e86",
    measurementId: "G-TCF2MRJRTY"
};

// Initialize Firebase
let db;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Error initializing Firebase:', error);
    throw new Error('Failed to initialize Firebase: ' + error.message);
}

// Function to create a strictly ordered pet object
function createOrderedPetObject(data) {
    // First, create the foster care object with specific order
    let orderedData = {};
    
    // 1. ID (first field)
    orderedData.id = data.id || '';
    
    // 2. Name
    orderedData.name = data.name || '';
    
    // 3. Breed
    orderedData.breed = data.breed || '';
    
    // 4. Age
    orderedData.age = data.age || 0;
    
    // 5. Gender
    orderedData.gender = data.gender || '';
    
    // 6. Origin
    orderedData.origin = data.origin || '';
    
    // 7. Temperament
    orderedData.temperament = data.temperament || '';
    
    // 8. Story
    orderedData.story = data.story || '';
    
    // 9. Image URL
    orderedData.imageUrl = data.imageUrl || '';
    
    // 10. Foster Care (with ordered sub-fields)
    orderedData.fosterCare = {};
    orderedData.fosterCare.name = data.fosterCare?.name || '';
    orderedData.fosterCare.address = data.fosterCare?.address || '';
    orderedData.fosterCare.city = data.fosterCare?.city || '';
    orderedData.fosterCare.state = data.fosterCare?.state || '';
    orderedData.fosterCare.pincode = data.fosterCare?.pincode || '';
    orderedData.fosterCare.phone = data.fosterCare?.phone || '';
    orderedData.fosterCare.email = data.fosterCare?.email || '';
    
    // 11. Status
    orderedData.status = data.status || 'Available';
    
    // 12. Created At
    orderedData.createdAt = Timestamp.now();
    
    // 13. Updated At
    orderedData.updatedAt = Timestamp.now();

    return orderedData;
}

// Function to add a single pet to Firebase
export async function addSinglePet(petData) {
    if (!db) {
        throw new Error('Firebase not initialized');
    }

    try {
        const orderedPetData = createOrderedPetObject(petData);
        const docRef = doc(db, "pets", petData.id);
        
        // Add fields one by one in specific order
        await setDoc(docRef, {});  // Create empty document first
        
        // Add fields in sequence
        for (const [key, value] of Object.entries(orderedPetData)) {
            await setDoc(docRef, { [key]: value }, { merge: true });
        }
        
        console.log(`Added pet: ${petData.name} with ID: ${petData.id}`);
        return orderedPetData;
    } catch (error) {
        console.error("Error adding pet: ", error);
        throw new Error('Failed to add pet: ' + error.message);
    }
}

// Function to add all pets to Firebase
export async function addAllPets() {
    if (!db) {
        throw new Error('Firebase not initialized');
    }

    try {
        // First, check if pets exist and delete them
        const querySnapshot = await getDocs(collection(db, "pets"));
        if (!querySnapshot.empty) {
            const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);
            console.log("Cleared existing pets collection");
        }

        // Add each pet with ordered properties
        for (const petData of petsData) {
            const orderedPetData = createOrderedPetObject(petData);
            const docRef = doc(db, "pets", petData.id);
            
            // Add fields one by one in specific order
            await setDoc(docRef, {});  // Create empty document first
            
            // Add fields in sequence
            for (const [key, value] of Object.entries(orderedPetData)) {
                await setDoc(docRef, { [key]: value }, { merge: true });
            }
            
            console.log(`Added pet: ${petData.name} with ID: ${petData.id}`);
        }
        console.log("All pets added successfully!");
    } catch (error) {
        console.error("Error adding pets: ", error);
        throw new Error('Failed to add pets: ' + error.message);
    }
}

// Function to get ordered pet data from a Firestore document
export function getOrderedPetData(petDoc) {
    const data = petDoc.data();
    return createOrderedPetObject(data);
}

// Function to get all pets from Firebase
export async function getAllPets() {
    if (!db) {
        throw new Error('Firebase not initialized');
    }

    try {
        const querySnapshot = await getDocs(collection(db, "pets"));
        const pets = querySnapshot.docs.map(doc => getOrderedPetData(doc));
        return pets.sort((a, b) => a.id.localeCompare(b.id));
    } catch (error) {
        console.error("Error getting pets: ", error);
        throw new Error('Failed to get pets: ' + error.message);
    }
}

// Function to delete a pet by ID
export async function deletePet(petId) {
    if (!db) {
        throw new Error('Firebase not initialized');
    }

    try {
        await deleteDoc(doc(db, "pets", petId));
        console.log(`Deleted pet with ID: ${petId}`);
    } catch (error) {
        console.error("Error deleting pet: ", error);
        throw new Error('Failed to delete pet: ' + error.message);
    }
}

// Export createOrderedPetObject for use in other files
export { createOrderedPetObject };

// Export the sample pets data
export const petsData = [
    {
        id: "PP001",
        name: "Bella",
        breed: "Labrador Retriever",
        age: 2,
        gender: "Female",
        origin: "Newfoundland, Canada",
        temperament: "Friendly, Energetic, Playful",
        story: "Bella is a sweet and energetic Labrador who loves playing fetch and going for long walks. She's great with children and other pets, making her the perfect family companion.",
        imageUrl: "https://i.pinimg.com/474x/8b/4f/68/8b4f68fa3cae921a6661350784422199.jpg",
        fosterCare: {
            name: "Paws & Tails Animal Shelter",
            address: "123, Green Park",
            city: "New Delhi",
            state: "Delhi",
            pincode: "110016",
            phone: "+91 98765 43210",
            email: "pawsandtails@gmail.com"
        },
        status: "Available"
    },
    {
        id: "PP002",
        name: "Max",
        breed: "Golden Retriever",
        age: 3,
        gender: "Male",
        origin: "Scotland, United Kingdom",
        temperament: "Gentle, Loyal, Calm",
        story: "Max is a gentle giant with a heart of gold. He's well-trained and loves to cuddle. His calm demeanor makes him perfect for families with young children.",
        imageUrl: "https://i.pinimg.com/474x/5c/3d/87/5c3d879cddf4ee95cd11e5685ec06a71.jpg",
        fosterCare: {
            name: "Happy Tails Rescue Center",
            address: "456, Bandra West",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400050",
            phone: "+91 87654 32109",
            email: "happytails@gmail.com"
        },
        status: "Available"
    },
    {
        id: "PP003",
        name: "Luna",
        breed: "Beagle",
        age: 1.5,
        gender: "Female",
        origin: "England, United Kingdom",
        temperament: "Curious, Playful, Social",
        story: "Luna is a curious and playful Beagle who loves exploring and sniffing around. She's very social and gets along well with other dogs.",
        imageUrl: "https://i.pinimg.com/736x/ed/ce/f1/edcef1d8e7c5d927d3c3f0f74fb838e9.jpg",
        fosterCare: {
            name: "Pet Haven Foundation",
            address: "789, Koramangala",
            city: "Bangalore",
            state: "Karnataka",
            pincode: "560034",
            phone: "+91 76543 21098",
            email: "pethaven@gmail.com"
        },
        status: "Available"
    },
    {
        id: "PP004",
        name: "Oliver",
        breed: "British Shorthair",
        age: 1,
        gender: "Male",
        origin: "England, United Kingdom",
        temperament: "Independent, Affectionate, Calm",
        story: "Oliver is a dignified British Shorthair who enjoys his independence but also loves cuddle time. He's perfect for someone looking for a low-maintenance companion.",
        imageUrl: "https://i.pinimg.com/474x/9a/85/32/9a85328f087e5f5bbd1b5d9790570c81.jpg",
        fosterCare: {
            name: "Purrfect Paws Sanctuary",
            address: "321, Jubilee Hills",
            city: "Hyderabad",
            state: "Telangana",
            pincode: "500033",
            phone: "+91 65432 10987",
            email: "purrfectpaws@gmail.com"
        },
        status: "Available"
    },
    {
        id: "PP005",
        name: "Milo",
        breed: "Maine Coon",
        age: 2,
        gender: "Male",
        origin: "Maine, United States",
        temperament: "Gentle, Social, Playful",
        story: "Milo is a majestic Maine Coon with a gentle personality. He loves being around people and is known for his dog-like behavior.",
        imageUrl: "https://i.pinimg.com/474x/ec/b1/d8/ecb1d847c5d1f20b7998841850936f38.jpg",
        fosterCare: {
            name: "Cozy Cat Cottage",
            address: "654, Salt Lake City",
            city: "Kolkata",
            state: "West Bengal",
            pincode: "700091",
            phone: "+91 54321 09876",
            email: "cozycat@gmail.com"
        },
        status: "Available"
    },
    {
        id: "PP006",
        name: "Coco",
        breed: "Holland Lop",
        age: 0.5,
        gender: "Female",
        origin: "Netherlands",
        temperament: "Friendly, Curious, Playful",
        story: "Coco is an adorable Holland Lop who loves hopping around and exploring. She's very friendly and enjoys being petted.",
        imageUrl: "https://i.pinimg.com/474x/cb/f5/1b/cbf51bd92a3561611bc6707b5f6e5107.jpg",
        fosterCare: {
            name: "Bunny Haven",
            address: "987, Baner Road",
            city: "Pune",
            state: "Maharashtra",
            pincode: "411045",
            phone: "+91 43210 98765",
            email: "bunnyhaven@gmail.com"
        },
        status: "Available"
    }
].sort((a, b) => a.id.localeCompare(b.id)); 