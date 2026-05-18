const mongoose = require('mongoose');
const { CreditListing } = require('./models/credit');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/ecomine', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN FOR SEEDING CREDITS!!!");
        seedCredits();
    })
    .catch(err => {
        console.log("MONGO CONNECTION ERROR!!!!", err);
    });

const sampleCredits = [
    {
        name: "Amazon Rainforest Reforestation Initiative",
        description: "Restoring and conserving depleted tropical rainforest zones in the Amazon Basin. Highly certified project focused on biodiversity restoration and carbon capture.",
        price: 15,
        available: 500,
        projectType: "Afforestation / Forestry",
        location: "Amazon Basin, Brazil",
        verificationStandard: "VCS (Verified Carbon Standard) & CCB"
    },
    {
        name: "Rajasthan Desert Solar Plant Energy Offset",
        description: "Harnessing solar power to displace fossil-fuel-dominated grids in Northwestern India. Promotes clean energy development and local jobs.",
        price: 10,
        available: 1200,
        projectType: "Solar Power / Renewables",
        location: "Rajasthan, India",
        verificationStandard: "Gold Standard (GS)"
    },
    {
        name: "West Texas Wind Farm Project",
        description: "A large-scale wind energy installation displacing carbon-intensive natural gas generation. High efficiency wind turbines providing clean energy.",
        price: 8,
        available: 850,
        projectType: "Wind Energy / Renewables",
        location: "Texas, USA",
        verificationStandard: "Gold Standard (GS)"
    },
    {
        name: "Munich Landfill Methane Capture & Utilization",
        description: "Capturing highly destructive methane gas emissions from landfills and turning them into electricity and heat. Reduces direct atmosphere heat traps.",
        price: 12,
        available: 600,
        projectType: "Methane Capture",
        location: "Munich, Germany",
        verificationStandard: "VCS (Verified Carbon Standard)"
    }
];

async function seedCredits() {
    try {
        // Clear existing listings first
        await CreditListing.deleteMany({});
        console.log("Cleared existing credit listings.");
        
        // Insert new listings
        const docs = await CreditListing.insertMany(sampleCredits);
        console.log(`Successfully seeded ${docs.length} Carbon Credit listings!`);
    } catch (err) {
        console.error("Error seeding carbon credits:", err);
    } finally {
        mongoose.connection.close();
    }
}
