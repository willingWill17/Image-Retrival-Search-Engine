# import open_clip    
# from tqdm import tqdm
# import numpy as np
from pymilvus import connections, Collection
import torch
from PIL import Image
import sys
sys.path.insert(0,"/mlcv2/WorkingSpace/Personal/longlb/AIC_2024/EVACLIP/EVA/EVA-CLIP/rei")
from eva_clip import create_model_and_transforms, get_tokenizer
class model():
    def __init__(self) -> None:
        self.device = "cuda"
        self.model,_, self.preprocess = create_model_and_transforms("EVA02-CLIP-L-14-336" ,pretrained="eva_clip",force_custom_clip=True)
        self.model.to(self.device).eval()
        self.tokenizer = get_tokenizer("EVA02-CLIP-L-14-336")
    def text_embedding(self,text):
        text_tokens = self.tokenizer([text]).to(self.device)
        with torch.no_grad(),torch.cuda.amp.autocast():
            text_features = self.model.encode_text(text_tokens)
            text_features /= text_features.norm(dim=-1, keepdim=True)
            text_features = text_features.cpu().numpy().astype('float32')[0]
        return text_features
    def image_embedding(self,image_path):
        image = Image.open(image_path).convert("RGB")
        image = self.preprocess(image).unsqueeze(0).to(self.device)
        with torch.no_grad(),torch.cuda.amp.autocast():
            image_features = self.model.encode_image(image).to(self.device)
            image_features /= image_features.norm(dim=-1, keepdim=True)
            image_features = image_features.cpu().numpy().astype("float32")[0]
        return image_features

connections.connect(uri='http://milvus-standalone:19530')
collection = Collection("evaclip2")
collection.flush()
collection.load()
evaclip = model()   