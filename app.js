require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');


app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
    res.json({
        message: "backend is running"
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
