import styled from 'styled-components';
import { MutatingDots } from 'react-loader-spinner';

const Container = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
`;

const Loading = () => {
  return (
    <Container>
      <MutatingDots
        height="100"
        width="100"
        color="#ffffff"
        secondaryColor="#ffffff"
        radius="20"
        ariaLabel="mutating-dots-loading"
        visible={true}
      />
    </Container>
  );
};

export default Loading;
