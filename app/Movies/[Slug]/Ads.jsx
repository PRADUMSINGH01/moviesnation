import { useEffect } from "react";

// 1. Head Script Ad (Place in <head>)
export const HeadAd = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "//pl27094339.profitableratecpm.com/4f/8f/f9/4f8ff905a41c2232099bded39b8a2f0d.js";
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
};

// 2. Body Script Ads (Place anywhere in body)
export const BodyAd1 = () => {
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.text = `
      atOptions = {
        'key' : '0e828247f6746bb8922aab3dd36f5282',
        'format' : 'iframe',
        'height' : 300,
        'width' : 160,
        'params' : {}
      };
    `;

    const script2 = document.createElement("script");
    script2.src =
      "//www.highperformanceformat.com/0e828247f6746bb8922aab3dd36f5282/invoke.js";

    document.body.appendChild(script1);
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  return null;
};

export const BodyAd2 = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "//pl27094339.profitableratecpm.com/4f/8f/f9/4f8ff905a41c2232099bded39b8a2f0d.js";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export const BodyAd3 = () => {
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.text = `
      atOptions = {
        'key' : '6011885f0ffaaaf0c3c31a272559e1eb',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };
    `;

    const script2 = document.createElement("script");
    script2.src =
      "//www.highperformanceformat.com/6011885f0ffaaaf0c3c31a272559e1eb/invoke.js";

    document.body.appendChild(script1);
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  return null;
};

// 3. Footer Script Ad (Place before </body>)
export const FooterAd = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "//pl27094747.profitableratecpm.com/21/84/49/2184495f4d2be0d373f879cdcd0b6f23.js";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

// 4. Container Ad (Special placement)
export const ContainerAd = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.dataset.cfasync = false;
    script.src =
      "//pl27094209.profitableratecpm.com/5f0fe2e0ad86538bbdddc0db3ac3f5a9/invoke.js";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="container-5f0fe2e0ad86538bbdddc0db3ac3f5a9"></div>;
};

// 5. Hyperlink Ads (Standard anchor tags)
export const HyperlinkAd = () => (
  <a
    href="https://www.profitableratecpm.com/mxuf6yhw1?key=8b3a8975b0ba4277507334f940dafe55"
    target="_blank"
    rel="noopener noreferrer"
  >
    Ad Link
  </a>
);

// Main Ad Manager Component
const AdManager = () => {
  return (
    <>
      {/* Place in document <head> */}
      <HeadAd />
      {/* Place in body */}
      <BodyAd1 />
      <BodyAd2 />
      <BodyAd3 />
      {/* Hyperlinks - place anywhere */}
      <HyperlinkAd />
      <HyperlinkAd /> {/* Second instance if needed */}
      {/* Container ad - place where you want the container */}
      <ContainerAd />
      {/* Place just before </body> */}
      <FooterAd />
    </>
  );
};

export default AdManager;
