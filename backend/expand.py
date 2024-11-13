import torch
from PIL import Image
import requests


from transformers import AutoProcessor, PaliGemmaForConditionalGeneration

model_id = "google/paligemma-3b-mix-224"
model = PaliGemmaForConditionalGeneration.from_pretrained(model_id)
processor = AutoProcessor.from_pretrained(model_id)


def generate_suggestions(query, image_url, num_suggestions=5):
    # Tải hình ảnh
    image = Image.open(requests.get(image_url, stream=True).raw)
    
    # Xử lý đầu vào
    inputs = processor(images=image, text=query, return_tensors="pt")
    
    # Tạo đề xuất
    output = model.generate(
        **inputs,
        max_new_tokens=20,
        num_return_sequences=num_suggestions,
        no_repeat_ngram_size=2,
        do_sample=True,
        top_k=50,
        top_p=0.95,
        temperature=0.7
    )
    
    # Giải mã đầu ra
    suggestions = processor.batch_decode(output, skip_special_tokens=True)
    
    return suggestions

# Sử dụng hàm
query = "1 man doing sand painting"
image_url = "https://example.com/sand_painting_image.jpg"
suggestions = generate_suggestions(query, image_url)

for suggestion in suggestions:
    print(suggestion)