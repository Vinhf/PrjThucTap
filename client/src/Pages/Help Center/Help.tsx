import React, { useState } from 'react';
import register1 from './Image/register1.png'
import register2 from './Image/register2.png'
import register3 from './Image/register3.png'
import register4 from './Image/register4.png'
import wallet1 from './Image/wallet1.png'
import wallet2 from './Image/wallet2.png'
import wallet3 from './Image/wallet3.png'
import wallet4 from './Image/wallet4.png'
import wallet5 from './Image/wallet5.png'
import wallet6 from './Image/wallet6.png'
import wallet7 from './Image/wallet7.png'

// Define the data structure for help topics
interface HelpTopic {
  id: number;
  title: string;
  content: string[];
  imageUrl: string[];
}

// Sample data array with unique content and images
const helpTopics: HelpTopic[] = [
  {
    id: 1,
    title: 'Làm Thế Nào Để Tạo Tài Khoản?',
    content: [
      'Bước 1: Bấm vào avatar ở góc phải màn hình',
      'Bước 2: Bấm vào "Register" để chuyển sang giao diện đăng ký',
      'Bước 3: Nhập đầy đủ thông tin đăng ký và bấm "Sign Up',
      'Bước 4: Nhập mã OTP được gửi qua email đăng ký và bấm "Xác Nhận'
    ],
    imageUrl: [
      register1,
      register2,
      register3,
      register4,
    ],
  },
  {
    id: 2,
    title: 'Cách xem số dư ví và Nạp tiền vào Ví',
    content: [
      'Bước 1: Bấm vào avartar ở góc phải màn hình',
      'Bước 2: Bấm vào "My Wallet" để kiểm tra số dư',
      'Bước 3: Bấm vào "Top up your wallet" để nạp tiền vào ví qua Tài Khoản Ngân Hàng',
      'Bước 4: Nhập số tiền muốn nạp trong ô "Amount" và bấm "Pay"',
      'Bước 5: Chọn phương thức thanh toán',
      'Bước 6: Chọn ngân hàng bạn đang sử dụng',
      'Bước 7: Nhập đầy đủ thông tin tài khoản thẻ của bạn và bấm "Tiếp tục"',
      'Bước 8: Nhập mã OTP được gửi về SDT mà bạn đăng ký tài khoản ngân hàng và bấm "Thanh Toán", như vậy là bạn đã nạp tiền vào ví thành công',
    ],
    imageUrl: [
      register1,
     wallet1,
      wallet2,
      wallet3,
      wallet4,
      wallet5,
      wallet6,
      wallet7,
    ],
  },
];

const HelpCenter: React.FC = () => {
  const [expandedTopicId, setExpandedTopicId] = useState<number | null>(null);

  const toggleTopic = (id: number) => {
    setExpandedTopicId(expandedTopicId === id ? null : id);
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Help Center</h1>
      <div className="space-y-4">
        {helpTopics.map(topic => (
          <HelpTopic 
            key={topic.id}
            topic={topic}
            isExpanded={expandedTopicId === topic.id}
            toggleTopic={toggleTopic}
          />
        ))}
      </div>
    </div>
  );
};

interface HelpTopicProps {
  topic: HelpTopic;
  isExpanded: boolean;
  toggleTopic: (id: number) => void;
}

const HelpTopic: React.FC<HelpTopicProps> = ({ topic, isExpanded, toggleTopic }) => {
  return (
    <div className="border rounded-lg shadow-sm p-4 bg-white">
      <h2 
        className="text-2xl font-medium cursor-pointer"
        onClick={() => toggleTopic(topic.id)}
      >
        {topic.title}
      </h2>
      {isExpanded && <HelpContent content={topic.content} imageUrl={topic.imageUrl} />}
    </div>
  );
};

interface HelpContentProps {
  content: string[];
  imageUrl: string[];
}

const HelpContent: React.FC<HelpContentProps> = ({ content, imageUrl }) => {
  return (
    <div className="mt-4 font-medium text-2xl">
      {content.map((text, index) => (
        <div key={index} className="mb-4">
          <p>{text}</p>
          {imageUrl[index] && (
            <img src={imageUrl[index]} alt={`Help content ${index + 1}`} className="max-w-100 h-auto rounded-md" />
          )}
        </div>
      ))}
    </div>
  );
};

export default HelpCenter;
