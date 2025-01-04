
const express = require('express');
const app = express();
const PORT = 3000;


const func1 = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                { name: 'Vindaloo', description: 'Spicy Goan curry', price: 250 },
                { name: 'Prawn Balchao', description: 'Tangy prawn pickle', price: 300 }
            ]);
        }, 115);
    });
};

const func2 = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                { foodName: 'Vindaloo', locations: ['Panaji', 'Margao'] },
                { foodName: 'Prawn Balchao', locations: ['Vasco', 'Candolim'] }
            ]);
        }, 120000); 
    });
};

const func3 = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                { foodName: 'Vindaloo', calories: 450, protein: '25g', carbs: '40g' },
                { foodName: 'Prawn Balchao', calories: 200, protein: '15g', carbs: '5g' }
            ]);
        }, 300);
    });
};

const func4 = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(['Prawn Balchao']); 
        }, 100);
    });
};


const mergeData = async () => {
    const [foodList, locations, nutritionalInfo, stockOutFoods] = await Promise.all([
        func1(),
        func2(),
        func3(),
        func4()
    ]);

    const mergedData = foodList.map(food => {
        const locationData = locations.find(loc => loc.foodName === food.name) || {};
        const nutritionData = nutritionalInfo.find(nutri => nutri.foodName === food.name) || {};

        return {
            ...food,
            locations: locationData.locations || [],
            nutritionalInfo: nutritionData || {},
            stockOut: stockOutFoods.includes(food.name)
        };
    });

    return mergedData;
};


app.get('/api/food', async (req, res) => {
    try {
        const data = await mergeData();
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching data',
            error: error.message
        });
    }
});


app.get('/', (req, res) => {
    res.send('Welcome to the Food API! Visit /api/food to get food data.');
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
