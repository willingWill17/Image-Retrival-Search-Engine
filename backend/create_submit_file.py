from pathlib import Path

def add_submission_to_csv(file_name, vid_name, frame_idx, answer=None):
    base_folder = Path("/mlcv2/WorkingSpace/Personal/longlb/AIC_2024/data/submission/p3")
    with open(base_folder / file_name, mode='a+', newline='') as file:
        file.write(f"{vid_name}, {frame_idx}")
        if answer:
            file.write(f", {answer}")
        file.write("\n")
#add_submission_to_csv('test.csv','caaffa','16444')
    