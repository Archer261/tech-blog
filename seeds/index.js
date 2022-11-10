const sequelize = require("../config/connection");
const { Post, User } = require("../models");

const postData = require("./post-seeds.json");
const userData = require("./user-seeds.json");

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    await Post.bulkCreate(postData, {
        individualHooks: true,
        returning: true,
    });

    await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    process.exit(0);
};

seedDatabase();
