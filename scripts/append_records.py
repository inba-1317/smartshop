import json
import os

records_file = '/app/applet/src/data/shopping_dataset.json'

def init_file():
    os.makedirs(os.path.dirname(records_file), exist_ok=True)
    with open(records_file, 'w') as f:
        json.dump([], f)

def append_csv_text(csv_text):
    if not os.path.exists(records_file):
        init_file()
    
    with open(records_file, 'r') as f:
        data = json.load(f)
    
    lines = csv_text.strip().split('\n')
    for line in lines:
        parts = [p.strip() for p in line.split(',')]
        if len(parts) >= 17:
            # Handles index, id, age, gender... or id, age, gender...
            # If parts[0] is index, then parts[1] is id
            offset = 1 if len(parts) == 18 else 0
            try:
                rec = {
                    "id": int(parts[offset + 0]),
                    "age": int(parts[offset + 1]),
                    "gender": parts[offset + 2],
                    "item": parts[offset + 3],
                    "category": parts[offset + 4],
                    "amount": float(parts[offset + 5]),
                    "location": parts[offset + 6],
                    "color": parts[offset + 7],
                    "season": parts[offset + 8],
                    "rating": float(parts[offset + 9]),
                    "subscribed": parts[offset + 10].lower() == 'yes',
                    "shipping": parts[offset + 11],
                    "discount": parts[offset + 12].lower() == 'yes',
                    "promo": parts[offset + 13].lower() == 'yes',
                    "previousPurchases": int(parts[offset + 14]),
                    "payment": parts[offset + 15],
                    "frequency": parts[offset + 16]
                }
                data.append(rec)
            except Exception as e:
                continue

    with open(records_file, 'w') as f:
        json.dump(data, f)
    print(f"Total records now: {len(data)}")

if __name__ == '__main__':
    init_file()
