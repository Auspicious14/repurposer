import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedInShareButton,
  WhatsappShareButton,
} from "react-share";

interface ShareButtonsProps {
  platform: string;
  url: string;
  title: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ platform, url, title }) => {
  const getPlatformShares = () => {
    const shares = {
      "Twitter/X (Thread)": [<TwitterShareButton key="twitter" url={url} title={title} className="px-3 py-1 bg-blue-400 text-white rounded-md hover:bg-blue-500" />],
      LinkedIn: [<LinkedInShareButton key="linkedin" url={url} title={title} className="px-3 py-1 bg-blue-700 text-white rounded-md hover:bg-blue-800" />],
      "Instagram Caption": [<WhatsappShareButton key="whatsapp" url={url} title={title} separator=" " className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600" />], // Instagram via WhatsApp as proxy
      "YouTube Description": [<FacebookShareButton key="facebook" url={url} quote={title} className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700" />],
      "Blog Summary": [<LinkedInShareButton key="linkedin" url={url} title={title} className="px-3 py-1 bg-blue-700 text-white rounded-md hover:bg-blue-800" />, <TwitterShareButton key="twitter" url={url} title={title} className="px-3 py-1 bg-blue-400 text-white rounded-md hover:bg-blue-500" />],
    };
    return shares[platform] || []; // Default to empty if platform not mapped
  };

  return (
    <div className="flex gap-2 mt-2">
      {getPlatformShares()}
    </div>
  );
};

export default ShareButtons;
