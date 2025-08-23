import { User } from "@/types/post";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Send } from "lucide-react";
import { useState } from "react";

function MessageBoxModal({
  show,
  onHide,
  nowUser,
  other,
}: {
  show: boolean;
  onHide: () => void;
  nowUser: number;
  other: User;
}) {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (!message) return;

    alert(message);
    setMessage("");
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {other.username}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>메세지가 오는 칸</p>
      </Modal.Body>
      <Modal.Footer>
        <InputGroup className="flex-1">
          <Form.Control
            placeholder="메시지를 입력하세요."
            aria-describedby="basic-addon2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            variant="outline-secondary"
            id="button-addon2"
            onClick={sendMessage}
          >
            <Send />
          </Button>
        </InputGroup>
      </Modal.Footer>
    </Modal>
  );
}

export default MessageBoxModal;
