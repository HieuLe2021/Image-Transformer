import type { PromptTemplateGroup } from './types';

export const templateGroups: PromptTemplateGroup[] = [
  {
    groupTitle: 'Hyper-realistic',
    templates: [
        {
            title: 'Artistic Image Generation',
            prompt: 'Create concept art for a futuristic city with neon lights and flying spaceships. hyper realistic, 8k resolution, digital artwork.'
        },
        {
            title: 'Male Cinematic Artwork',
            prompt: `Create a hyper-realistic 8K cinematic close-up photo of a man (use attached photo) performing an avatar bending stance outdoors.  
A swirling elemental ring of all four elements—earth, air, water, and fire—surrounds him, forming a majestic dragon that looks alive.  
The dragon’s body is a fusion of elements: fiery whiskers, molten claws, glowing embers, flowing water scales, mist, droplets, icy refractions, rocks, pebbles, dust, sand, strong winds swirling around.  
The dragon coils dynamically around the man, with dramatic twists, sharp claws, detailed whiskers, glowing eyes, and cinematic motion blur.  
Natural physics simulation: water splashes, fire sparks, smoke trails, glowing embers, wind distortion, flying debris.  
Cinematic composition, ultra-detailed textures, volumetric lighting, HDR contrast, depth of field, sharp focus on the man and dragon.  
Epic atmosphere, photo-realistic rendering, hyper-detailed, 8K resolution.`
        },
        {
            title: 'Person at a PC desk',
            prompt: `Use the Nano-Banana model to create a 1/7 scale commercial model of the illustrated character, rendered in authentic style, lighting, and enviroment. 

Place the figure on a computer desk, mounted on a circular, clear acrylic base with no text. On the computer screen, display the Brush process of the model. Next to the screen, include a Bandai-style toy box with the original illustration.`
        },
        {
            title: 'Man x Phone',
            prompt: `A hyper-realistic digital artwork of a young man in a white hoodie and gray cargo pants stepping out of a giant 3D smartphone screen. His body transitions from digital particles and glowing social media icons (Twitter, YouTube, Instagram, etc.) into a fully realistic human form. The background is a futuristic neon-lit lab with purple ambient lights, a computer showing a digital skeleton scan, and a boxed action figure version of the same young man labeled “LIMULL AI.” The scene symbolizes the blend of technology, artificial intelligence, and human identity. Highly detailed, cinematic lighting, ultra-realism, 8K resolution, sci-fi poster aesthetic`
        },
        {
            title: 'Selfie with Superheroes',
            prompt: 'Photorealistic group selfie featuring [use uploaded image of the user] holding a cup of coffee. Surrounding him are the Justice League members — Superman, Batman, Wonder Woman, The Flash, Aquaman, and Cyborg — all smiling and posing casually like friends. The selfie has a fun, cheerful vibe, with everyone close together in frame, some characters leaning in playfully. Bright daylight, cinematic quality, natural colors, high detail.'
        },
        {
            title: 'Selfie with my idol on the street',
            prompt: `IdolName: \n\nTake an extremely ordinary and unremarkable iPhone selfie, with no clear subject or sense of composition—just a quick accidental snapshot. The photo has slight motion blur and uneven lighting from streetlights or indoor lamps, causing mild overexposure in some areas. The angle is awkward and the framing is messy, giving the picture a deliberately mediocre feel, as if it was taken absentmindedly while pulling the phone from a pocket. The main character is me (picture uploaded), and [IdolName] stands next to me, both caught in a casual, imperfect moment. The background shows a lively meyongdong street at night, with neon lights, traffic, and blurry figures passing by. The overall look is intentionally plain and random, capturing the authentic vibe of a poorly composed, spontaneous iPhone selfie`
        },
        {
            title: 'Selfie with my idol in the classroom',
            prompt: `Idol Name:\n\nUsed my image in a real-life scene inside a college classroom in the United States. It shows two college students sitting side by side, facing the camera, which represents the teacher at the front of the class. The student on the left is me (picture uploaded), wearing a long-sleeved, plaid shirt unbuttoned over a white Graphic Mixxx T-shirt, jeans, and black Chuck Taylors. At my desk is a hunter guard. \n\nThe student on the right is [Idol Name], sitting about two feet away from me. They are wearing a white sleeveless Marvel logo T-shirt and sunglasses folded over their head, a short knee-length skirt, and white sneakers. \n\nIn the background, some classmates are listening intently, while others are raising their hands, creating a lively classroom atmosphere with desks, chairs, a blackboard or whiteboard, and typical college decor.`
        }
    ]
  },
  {
    groupTitle: 'Ultra-realistics',
    templates: [
        {
            title: 'Ghép ảnh',
            prompt: 'Ghép nhân vật trong ảnh này đứng cạnh một chiếc xe điện Tesla màu trắng, bối cảnh là thành phố New York vào ban đêm với ánh đèn neon.'
        },
        {
            title: 'Chân dung siêu thực',
            prompt: 'Tạo một bức chân dung siêu thực của một ngư dân già với làn da rám nắng, nếp nhăn sâu và biểu cảm thông thái. Ánh sáng nên dịu và tự nhiên, làm nổi bật kết cấu da và chi tiết trong mắt. Chụp bằng máy ảnh Sony A7R IV với ống kính 85mm f/1.4 GM.'
        },
        {
            title: 'Thay đổi phong cách, ánh sáng',
            prompt: 'Áp dụng phong cách nhiếp ảnh điện ảnh (cinematic photography style) cho bức ảnh này, với ánh sáng dịu và tông màu ấm.'
        },
        {
            title: 'Đổi, xóa Nền, vật phẩm',
            prompt: 'Xóa phông nền phía sau đối tượng chính và thay bằng một bãi biển nhiệt đới. Xóa chiếc mũ mà người đó đang đội.'
        },
        {
            title: 'Sửa phông, nền',
            prompt: 'Giữ nguyên khuôn mặt và trang phục trong ảnh này, nhưng thay nền thành phong cảnh biển xanh vào lúc hoàng hôn.'
        },
        {
            title: 'Thay đổi góc nhìn',
            prompt: 'Thay đổi góc nhìn của bức ảnh này sang góc nhìn từ trên cao xuống, giữ nguyên các chi tiết chính của đối tượng.'
        },
        {
            title: 'Chỉnh sửa chi tiết',
            prompt: 'Thay đổi kiểu tóc nhân vật trong ảnh thành tóc ngắn uốn nhẹ, giữ nguyên mọi chi tiết khác. Phần thay đổi cần tự nhiên và không bị lộ.'
        },
    ]
  }
];