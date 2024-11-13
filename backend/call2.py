from pymilvus import connections, Collection
import torch
import sys
sys.path.insert(0,"/mlcv2/WorkingSpace/Personal/longlb/AIC_2024/demo_system/unilm/beit3")
from modeling_finetune import BEiT3ForRetrieval
from modeling_utils import _get_large_config
from transformers import XLMRobertaTokenizer
from torchvision import transforms
from timm.data.constants import  IMAGENET_DEFAULT_MEAN, IMAGENET_DEFAULT_STD
import open_clip

connections.connect(uri='http://milvus-standalone:19530')
collection1 = Collection("aic5")
collection1.flush()
collection1.load()
collection2 = Collection("keyword5")
collection2.flush()
collection2.load()

tokenizer1 = XLMRobertaTokenizer("/mlcv2/WorkingSpace/Personal/longlb/AIC_2024/demo_system/models/beit3.spm")
tokenizer2 = open_clip.get_tokenizer('ViT-H-14-378-quickgelu')

#weight_path = '/mlcv2/WorkingSpace/Personal/longlb/AIC_2024/demo_system/models/beit3_large_patch16_384_f30k_retrieval.pth'
weight_path = '/mlcv2/WorkingSpace/Personal/longlb/AIC_2024/demo_system/models/beit3_large_patch16_384_coco_retrieval.pth'
transform_img = transforms.Compose([
    transforms.Resize((384,384)),
    transforms.ToTensor(),
    transforms.Normalize(mean=IMAGENET_DEFAULT_MEAN,std=IMAGENET_DEFAULT_STD),
])

args = _get_large_config(img_size=384)
state_dict = torch.load(weight_path, map_location=torch.device('cuda'),weights_only=True)["model"]

model1 = BEiT3ForRetrieval(args=_get_large_config(img_size=384))
model1.load_state_dict(state_dict, strict=False)
model1.to('cuda').eval()

model2, _, preprocess = open_clip.create_model_and_transforms('ViT-H-14-378-quickgelu', pretrained='dfn5b')
model2.to('cuda').eval() 


