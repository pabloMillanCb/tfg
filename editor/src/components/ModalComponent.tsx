import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';

interface ModalInterface {
    open: boolean,
    tittle: string,
    text: string,
    textButton: string,
    fun: () => void,
    onClose: () => void,
    color: string
}

const ModalComponent = ({tittle, textButton, text, fun, onClose, open, color=''}: ModalInterface) => {

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        color: 'white',
        backgroundColor: 'rgb(71, 70, 70)',
        boxShadow: 24,
        textAlign: "center",
        p: 4,
        
      };

    return(
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                {tittle}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {text}
                </Typography>
                <Stack className="center margin" spacing={2} direction="row">
                    <Button className="margin" variant="contained" onClick={onClose} color="secondary" >Cancelar</Button>
                    <Button className="margin" variant="contained" onClick={fun} color="error">{textButton}</Button>
                </Stack>
                
            </Box>
        </Modal>
    )
}

export default ModalComponent;