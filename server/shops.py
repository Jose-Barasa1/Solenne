

from app import app, db
from models import Shop

def seed_shops():
    with app.app_context():
        shops = [
            Shop(name="Artistic Wonders", type="art", image_url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2BbYYGnV6w3SXQxbMlJjWgJEzXlTErEGjoA&s"),
            Shop(name="Jewelry Gems", type="jewelry", image_url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRICOHLlNPWwKDpBmGPAGrNEx--WxsmrAIpPA&s"),
            Shop(name="Modern Artistry", type="art", image_url="https://cdn.britannica.com/87/2087-050-8B2A01CD/Mona-Lisa-oil-wood-panel-Leonardo-da.jpg"),
            Shop(name="Luxury Jewels", type="jewelry", image_url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_4ahMNo6ArmitfUsRD8Gwfrgre3i3g5m3oA&s"),
            Shop(name="Creative Canvas", type="art", image_url="https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvcGR2YW5nb2doLXNlbGYtcG9ydHJhaXQtbTAxLWpvYjY2MV8yLWwxMDBvNmVmLmpwZw.jpg"),
            Shop(name="Diamond Dreams", type="jewelry", image_url="https://thegoldavenue.co.za/wp-content/uploads/2023/08/Gold-Jewellery-on-Fabric-Background.jpg"),
            Shop(name="Color Splash", type="art", image_url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVkxPDAwHR2CTOqHMJ-IAfzXepxBcTc_9MEw&s"),
            Shop(name="Golden Glow", type="jewelry", image_url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTchKBab99DVstDnpzAVJD4-Wstlzui790HIw&s"),
            Shop(name="Abstract Aura", type="art", image_url="https://static.wixstatic.com/media/b7782b_d7fd195111d942b393c2196d2e6decc3~mv2.jpg/v1/fill/w_640,h_314,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/b7782b_d7fd195111d942b393c2196d2e6decc3~mv2.jpg"),
            Shop(name="Silver Spark", type="jewelry", image_url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_Pp_vusfZl7ahw6tT6Qz23pguKRKzU5YzxA&s"),
            Shop(name="The Art House", type="art", image_url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBM8hrLw89zHo5q3jGf334jkAPcHmFF4SYkw&s"),
            Shop(name="Elegant Earrings", type="jewelry", image_url="https://rukminim2.flixcart.com/image/850/1000/xif0q/jewellery-set/c/q/8/na-na-1-cbniti-deora-jewellery-original-imah35phy7dqddhu.jpeg?q=20&crop=false"),
            Shop(name="Brush & Palette", type="art", image_url="https://cdn.britannica.com/32/2832-050-9DD1D041/The-Scream-casein-cardboard-Edvard-Munch-National-1893.jpg"),
            Shop(name="Pearl Paradise", type="jewelry", image_url="https://m.media-amazon.com/images/I/714ITzZgFTL._AC_UY1100_.jpg"),
            Shop(name="Masterpiece Studio", type="art", image_url="https://m.media-amazon.com/images/I/81WUx+0i+VL._AC_UF1000,1000_QL80_.jpg"),
            Shop(name="Jewelry Junction", type="jewelry", image_url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ28DUEa8FC7PR_R4Wg8X7gQJXykedQ0E9Fqg&s"),
        ]

        db.session.bulk_save_objects(shops)
        db.session.commit()
        print("Successfully seeded 15 shops!")

if __name__ == "__main__":
    seed_shops()
