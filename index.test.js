const { db } = require('./db')
const { Restaurant, Menu, Item } = require('./models/index')
const { seedRestaurant,  seedMenu, } = require('./seedData');

describe('Restaurant and Menu Models', () => {
    /**
     * Runs the code prior to all tests
     */
    beforeAll(async () => {
        // the 'sync' method will create tables based on the model class
        // by setting 'force:true' the tables are recreated each time the 
        // test suite is run
        await db.sync({ force: true });
    });

    test('can create a Restaurant', async () => {
        const restaurant = await Restaurant.create(
            {
                name: "Saltgrass",
                location: "Houston",
                cuisine: "Steakhouse"
            }
        );
        expect(restaurant.name).toBe("Saltgrass");
    });

    test('can create a Menu', async () => {
        const menu = await Menu.create(
            { title: "Wines" }
        );
        expect(menu.title).toBe("Wines")
    });

    test('can update a Restaurant', async () => {
        await Restaurant.update(
            { location: "The Woodlands" },
            { where: {id: 1}}
        );
        const updatedRestaurant = await Restaurant.findByPk(1);
        expect(updatedRestaurant.location).toBe("The Woodlands"); 
    });

    test('can update a Menu', async () => {
        await Menu.update(
            { title: "Steaks" },
            { where: {id: 1}}
        );
        const updatedMenu = await Menu.findByPk(1);
        expect(updatedMenu.title).toBe("Steaks");
    });

    test('can delete a Restaurants', async () => {
        await Restaurant.destroy({ where: {id: 1}});
        const restaurants = await Restaurant.findAll();
        expect(restaurants.length).toBe(0);
    });

    test('can create an Item and associate it with a Menu', async () => {
        const menu = await Menu.create({ title: "Dinner" });
        const item = await Item.create({
          name: "Ribeye",
          image: "img.png",
          price: 50,
          vegetarian: false,
        });
    
        await menu.addItem(item);
    
        const menuWithItem = await Menu.findByPk(menu.id, {
          include: Item,
        });
    
        expect(menuWithItem.Items.length).toBe(1);
        expect(menuWithItem.Items[0].name).toBe("Ribeye");
      });
});