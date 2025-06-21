# seed.py
from app import app
from models import db, Product, Shop

with app.app_context():
    # Example shops
    shop1 = Shop.query.filter_by(name="Artistic Wonders").first()
    shop2 = Shop.query.filter_by(name="Jewelry Gems").first()

    # Art Products
    db.session.add_all([
        Product(shop_id=shop1.id, name="Abstract Expression", description="Vibrant colors and bold strokes.", price=150.00, image_url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcFqtdvm72FQFWn4eXSR1Zl2w-0fWIjOKfow&s", category="paintings", type="art"),
        Product(shop_id=shop1.id, name="Modern Sculpture", description="Minimalist stone sculpture.", price=320.00, image_url="https://oblist.com/cdn/shop/products/mc_db4Rcj0zO.jpg?v=1687178976", category="sculptures", type="art"),
    ])

    # Jewelry Products
    db.session.add_all([
        Product(shop_id=shop2.id, name="Ruby Necklace", description="Fine ruby embedded in gold.", price=450.00, image_url="https://nz.pandora.net/dw/image/v2/BKNF_PRD/on/demandware.static/-/Sites-pandora-master-catalog/default/dwed3bd184/productimages/singlepackshot/362666C01_RGB.jpg?sw=440&sh=440&sm=fit&sfrm=png&bgcolor=F5F5F5", category="necklaces", type="jewelry"),
        Product(shop_id=shop2.id, name="Diamond Ring", description="Sparkling diamond with platinum band.", price=600.00, image_url="https://www.brilliance.com/cdn-cgi/image/f=webp,width=1440,height=1440,quality=90/sites/default/files/vue/collections/engagement-rings-diamond_og.jpg", category="rings", type="jewelry"),
    ])

    db.session.commit()
    print("Seeded products successfully.")
