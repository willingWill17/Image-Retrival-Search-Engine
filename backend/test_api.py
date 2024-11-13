from openai import OpenAI
india_documents = [
    "Ấn Độ là quốc gia có dân số đông thứ hai trên thế giới, sau Trung Quốc.",
    "Thủ đô của Ấn Độ là New Delhi, một trong những trung tâm hành chính quan trọng của quốc gia.",
    "Nền văn hóa Ấn Độ rất đa dạng với hàng nghìn ngôn ngữ và tôn giáo.",
    "Ấn Độ nổi tiếng với hệ thống đường sắt dài thứ tư thế giới, vận chuyển hàng triệu người mỗi ngày.",
    "Bollywood là nền công nghiệp phim lớn nhất ở Ấn Độ và là một trong những ngành công nghiệp điện ảnh lớn nhất thế giới.",
    "Phật giáo được thành lập ở Ấn Độ bởi Đức Phật Thích Ca Mâu Ni vào thế kỷ thứ 5 trước Công nguyên.",
    "Ấn Độ là một trong những nền kinh tế phát triển nhanh nhất thế giới với ngành công nghệ thông tin phát triển mạnh mẽ.",
    "Hệ thống giáo dục ở Ấn Độ là một trong những hệ thống lớn nhất thế giới, đặc biệt nổi bật với các ngành khoa học và công nghệ.",
    "Ganges, dòng sông thiêng liêng của Ấn Độ, là biểu tượng quan trọng của nền văn hóa và tôn giáo nước này.",
    "Lễ hội Diwali là một trong những lễ hội lớn nhất ở Ấn Độ, được gọi là Lễ hội Ánh sáng.",
    "Taj Mahal là một trong bảy kỳ quan của thế giới hiện đại, được xây dựng tại Agra, Ấn Độ.",
    "Đạo Hindu là tôn giáo lớn nhất ở Ấn Độ với hàng tỷ tín đồ.",
    "Ấn Độ có diện tích đứng thứ bảy trên thế giới, với nhiều vùng địa lý đa dạng từ núi cao Himalaya đến các đồng bằng sông Hằng.",
    "Mahatma Gandhi là lãnh đạo vĩ đại của phong trào độc lập Ấn Độ, nổi tiếng với triết lý phi bạo lực.",
    "Ấn Độ là một trong những nhà sản xuất lúa gạo và lúa mì lớn nhất thế giới.",
    "Yoga có nguồn gốc từ Ấn Độ và đã trở thành một phần quan trọng của văn hóa sức khỏe toàn cầu.",
    "Ấn Độ là một trong những nước có lượng người nói tiếng Anh lớn nhất trên thế giới.",
    "Vùng Thung lũng Silicon của Ấn Độ, Bangalore, là trung tâm công nghệ quan trọng của cả nước.",
    "Lễ hội Holi, hay còn gọi là lễ hội sắc màu, là một trong những lễ hội đặc biệt và phổ biến ở Ấn Độ.",
    "Lịch sử Ấn Độ bao gồm các triều đại lớn như Maurya và Gupta, từng thống trị và phát triển vùng Nam Á.",
    "Ấn Độ giành độc lập từ Anh vào năm 1947, đánh dấu một bước ngoặt quan trọng trong lịch sử.",
    "Ẩm thực Ấn Độ đa dạng và nổi tiếng với các loại gia vị như cà ri, nghệ và gừng.",
    "Ấn Độ có hệ thống pháp luật dựa trên các điều lệ của Hiến pháp được thiết lập vào năm 1950.",
    "Ấn Độ là nước xuất khẩu phần mềm lớn trên thế giới, với các công ty công nghệ thông tin hàng đầu.",
    "Vùng Kashmir là khu vực tranh chấp lâu dài giữa Ấn Độ và Pakistan.",
    "Mumbai, thành phố lớn nhất Ấn Độ, là trung tâm tài chính và giải trí quan trọng của quốc gia.",
    "Ấn Độ có nền dân chủ lớn nhất thế giới với hàng triệu cử tri tham gia bầu cử.",
    "Sân bay quốc tế Indira Gandhi ở New Delhi là một trong những sân bay bận rộn nhất ở Ấn Độ.",
    "Thung lũng Ladakh ở phía bắc Ấn Độ nổi tiếng với cảnh quan thiên nhiên hùng vĩ và văn hóa Tây Tạng.",
    "Ấn Độ và Trung Quốc có chung đường biên giới dài và mối quan hệ phức tạp về ngoại giao và thương mại.",
    "Chính phủ Ấn Độ thực hiện nhiều chính sách nhằm cải thiện điều kiện sống và phát triển kinh tế cho nông dân.",
    "Ấn Độ là một trong những nước tiêu thụ vàng lớn nhất thế giới, chủ yếu là phục vụ cho trang sức và lễ hội.",
    "Các vũ điệu truyền thống như Bharatanatyam và Kathakali là biểu tượng văn hóa của Ấn Độ.",
    "Núi Everest, ngọn núi cao nhất thế giới, nằm ở dãy Himalaya gần biên giới Ấn Độ.",
    "Ấn Độ có dân số trẻ, với đa số dân số dưới 35 tuổi, đóng góp tích cực cho nền kinh tế.",
    "Lễ hội Ganesh Chaturthi, lễ hội tôn vinh vị thần Ganesha, là sự kiện văn hóa lớn ở Ấn Độ.",
    "Đất nước này có nhiều khu bảo tồn thiên nhiên và công viên quốc gia, nơi bảo vệ các loài động vật quý hiếm như hổ Ấn Độ.",
    "Ấn Độ là nước xuất khẩu trà lớn, với các vùng trồng chè nổi tiếng như Assam và Darjeeling.",
    "Ấn Độ tổ chức cuộc thi sắc đẹp Miss India, một trong những cuộc thi lâu đời và uy tín.",
    "Chương trình không gian của Ấn Độ đã phát triển mạnh mẽ với những sứ mệnh đáng chú ý như Chandrayaan và Mangalyaan.",
    "Ấn Độ là thành viên sáng lập của Phong trào Không Liên kết trong thời kỳ Chiến tranh Lạnh.",
    "Kiến trúc Mughal ở Ấn Độ có nhiều di sản văn hóa như pháo đài Agra và đền Taj Mahal.",
    "Trong hệ thống hành chính Ấn Độ, các bang có quyền tự trị và có chính quyền riêng biệt.",
    "Ấn Độ có ngành dệt may phát triển mạnh, là một trong những nhà sản xuất vải lớn nhất thế giới.",
    "Ấn Độ nổi tiếng với nền y học cổ truyền Ayurveda và đã thu hút sự quan tâm trên toàn cầu.",
    "Các hệ thống tín ngưỡng và triết học của Ấn Độ như Hindu giáo và Phật giáo có ảnh hưởng sâu rộng.",
    "Ấn Độ là một trong những nước có hệ thống đường bộ lớn nhất thế giới với hàng triệu km đường quốc lộ.",
    "Tiểu thuyết gia nổi tiếng người Ấn Độ, Arundhati Roy, đã giành giải Booker với tác phẩm 'The God of Small Things'.",
    "Chợ ẩm thực đường phố ở Ấn Độ nổi tiếng với các món ăn đa dạng như samosa, dosa và chaat.",
    "Ấn Độ là một quốc gia đa ngôn ngữ với hai ngôn ngữ chính thức là Hindi và tiếng Anh.",
    "Quân đội Ấn Độ là một trong những lực lượng quân đội lớn nhất thế giới, với sự hiện diện mạnh mẽ tại nhiều khu vực.",
    "Bộ phim 'Slumdog Millionaire' quay tại Ấn Độ và đạt nhiều giải thưởng, giúp nâng cao hình ảnh của điện ảnh Ấn Độ trên thế giới."
]
query = "Ấn Độ là một quốc gia như thế nào?"
client = OpenAI()
MODEL = "gpt-4o"
rerankmodule = client.chat.completions.create(
        model=MODEL,
        messages=[
             {"role": "system", "content": "You are an assistant helping to rerank documents for optimal semantic relevance to the input query using LLM-based similarity calculations."},
        {"role": "user", "content": [{"type": "text", "text": f"Given the following query: '{query}', from this list of documents: {india_documents}, rank the top 10 most relevant documents in descending order of relevance based on semantic similarity to the query. Return only the top 10 related documents without additional explanation or formatting, so they can be directly used in downstream processing."}]}
        ]
    )
print(rerankmodule.choices[0].message.content)