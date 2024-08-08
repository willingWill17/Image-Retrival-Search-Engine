from pymilvus import connections, Collection
import torch
import sys
sys.path.insert(0,"/mlcv2/WorkingSpace/Personal/longlb/AIC_2024/demo_system/unilm/beit3")
from modeling_finetune import BEiT3ForRetrieval
from modeling_utils import _get_large_config
from transformers import XLMRobertaTokenizer

def init_beit(weight_path):
    model = BEiT3ForRetrieval(args=_get_large_config(img_size=384))
    state_dict = torch.load(weight_path, map_location=torch.device('cuda'))["model"]
    model.load_state_dict(state_dict,strict=False)
    model.to('cuda').eval()
    return model


connections.connect(uri='http://milvus-standalone:19530')
collection = Collection("beit3")
collection.flush()
collection.load()
weight_path = '/mlcv2/WorkingSpace/Personal/longlb/AIC_2024/demo_system/models/beit3_large_patch16_384_f30k_retrieval.pth'
#weight_path = '/mlcv2/WorkingSpace/Personal/longlb/AIC_2024/demo_system/models/beit3_large_patch16_384_coco_retrieval.pth'
model = init_beit(weight_path)
tokenizer = XLMRobertaTokenizer("/mlcv2/WorkingSpace/Personal/longlb/AIC_2024/demo_system/models/beit3.spm")
 