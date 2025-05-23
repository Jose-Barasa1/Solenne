

from app import app, db
from models import Shop

def seed_shops():
    with app.app_context():
        shops = [
            Shop(name="Artistic Wonders", type="art", image_url="https://images.pexels.com/photos/3654216/pexels-photo-3654216.jpeg?auto=compress&cs=tinysrgb&w=600"),
            Shop(name="Jewelry Gems", type="jewelry", image_url=""),
            Shop(name="Modern Artistry", type="art", image_url="https://picsum.photos/id/1013/400/300"),
            Shop(name="Luxury Jewels", type="jewelry", image_url="https://picsum.photos/id/1014/400/300"),
            Shop(name="Creative Canvas", type="art", image_url="https://picsum.photos/id/1015/400/300"),
            Shop(name="Diamond Dreams", type="jewelry", image_url="https://picsum.photos/id/1016/400/300"),
            Shop(name="Color Splash", type="art", image_url="https://picsum.photos/id/1018/400/300"),
            Shop(name="Golden Glow", type="jewelry", image_url="https://picsum.photos/id/1020/400/300"),
            Shop(name="Abstract Aura", type="art", image_url="https://picsum.photos/id/1021/400/300"),
            Shop(name="Silver Spark", type="jewelry", image_url="https://picsum.photos/id/1022/400/300"),
            Shop(name="The Art House", type="art", image_url="https://picsum.photos/id/1023/400/300"),
            Shop(name="Elegant Earrings", type="jewelry", image_url="https://picsum.photos/id/1024/400/300"),
            Shop(name="Brush & Palette", type="art", image_url="https://picsum.photos/id/1025/400/300"),
            Shop(name="Pearl Paradise", type="jewelry", image_url="https://picsum.photos/id/1026/400/300"),
            Shop(name="Masterpiece Studio", type="art", image_url="https://picsum.photos/id/1027/400/300"),
            Shop(name="Jewelry Junction", type="jewelry", image_url="https://picsum.photos/id/1028/400/300"),
        ]

        db.session.bulk_save_objects(shops)
        db.session.commit()
        print("Successfully seeded 15 shops!")

if __name__ == "__main__":
    seed_shops()
