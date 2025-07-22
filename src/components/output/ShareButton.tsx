import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";

interface ShareButtonsProps {
  platform: string;
  url: string;
  title: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({
  platform,
  url,
  title,
}) => {
  const getPlatformShares = () => {
    const shares = {
      "Twitter": [
        <TwitterShareButton
          key="twitter"
          url={url}
          title={title}
          className="px-3 py-1 bg-blue-400 text-white rounded-md hover:bg-blue-500"
        >
          {" "}
          <TwitterIcon size={32} round />
        </TwitterShareButton>,
      ],
      LinkedIn: [
        <LinkedinShareButton
          key="linkedin"
          url={url}
          title={title}
          className="px-3 py-1 bg-blue-700 text-white rounded-md hover:bg-blue-800"
        >
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>,
      ],
      "Instagram Caption": [
        <WhatsappShareButton
          key="whatsapp"
          url={url}
          title={title}
          separator=" "
          className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>,
      ], // Instagram via WhatsApp as proxy
      "YouTube Description": [
        <FacebookShareButton
          key="facebook"
          url={url}
          // quote={title}
          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>,
      ],
      "Blog Summary": [
        <LinkedinShareButton
          key="linkedin"
          url={url}
          title={title}
          className="px-3 py-1 bg-blue-700 text-white rounded-md hover:bg-blue-800"
        >
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>,
        <TwitterShareButton
          key="twitter"
          url={url}
          title={title}
          className="px-3 py-1 bg-blue-400 text-white rounded-md hover:bg-blue-500"
        >
          <TwitterIcon size={32} round />
        </TwitterShareButton>,
      ],
    };
    return shares[platform as keyof typeof shares] || []; // Default to empty if platform not mapped
  };

  return <div className="flex gap-2 mt-2">{getPlatformShares()}</div>;
};

export default ShareButtons;
