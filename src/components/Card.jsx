import styled from "styled-components";

const CardContainer = styled.div`
  padding: clamp(15px, 4vw, 30px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  margin-bottom: clamp(15px, 3vw, 30px);
  text-align: center;
  color: white;
  width: 100%;
  box-sizing: border-box;
`;

const IconContainer = styled.div`
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(8px, 2vw, 15px);
  flex-wrap: wrap;
`;

const CollabSymbol = styled.span`
  font-size: clamp(24px, 5vw, 36px);
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
`;

const IconImage = styled.img`
  width: clamp(80px, 15vw, 120px);
  height: clamp(80px, 15vw, 120px);
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 4px solid rgba(255, 255, 255, 0.2);
`;

const IconEmoji = styled.div`
  font-size: clamp(48px, 10vw, 72px);
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h1`
  margin: 0 0 10px 0;
  font-size: clamp(24px, 6vw, 42px);
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  line-height: 1.2;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: clamp(14px, 3vw, 18px);
  opacity: 0.9;
  font-weight: 300;
  line-height: 1.4;
`;

const Card = ({
  icon = "📊",
  icon2 = null,
  title = "Instagram Analytics",
  subtitle = "Análisis detallado de engagement y rendimiento",
}) => {
  const isImageUrl = (iconPath) =>
    typeof iconPath === "string" &&
    (iconPath.startsWith("http") || iconPath.startsWith("/") || iconPath.startsWith("."));

  const renderIcon = (iconPath) => {
    if (isImageUrl(iconPath)) {
      return <IconImage src={iconPath} alt="icon" />;
    }
    return <IconEmoji>{iconPath}</IconEmoji>;
  };

  return (
    <CardContainer>
      <IconContainer>
        {renderIcon(icon)}
        {icon2 && (
          <>
            <CollabSymbol>×</CollabSymbol>
            {renderIcon(icon2)}
          </>
        )}
      </IconContainer>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
    </CardContainer>
  );
};

export default Card;
