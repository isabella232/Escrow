import * as React from 'react';

import Grid from '@mui/material/Grid';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import OfferCard from './OfferCard';
import { Button, Divider, List, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ListItemForm from './ListItemForm';
import { toast } from 'react-toastify';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';

import { useEscrow, useLoading, useGlobalContext } from '../Store';

import { Itype } from "../../api/escrow/escrow.did"
import { Item } from "../../api/escrow/escrow.did";
import { LIST_ITEM_NFT, LIST_ITEM_COIN, LIST_ITEM_MERCHANDISE, LIST_ITEM_SERVICE, LIST_ITEM_OTHER } from "../../lib/constants";
import OfferItem from './OfferItem';
import { Box } from '@mui/system';

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}
export default () => {

    const { state: {
        isAuthed
    } } = useGlobalContext();
    const escrow = useEscrow();
    const { setLoading } = useLoading()
    const [openListForm, setOpenListForm] = React.useState(false)

    const [itemType, setItemType] = React.useState(LIST_ITEM_NFT)
    const [offers, setOffers] = React.useState<Item[]>([]);

    React.useEffect(() => {
        loadOffers();
    }, [itemType]);

    const saveList = (data) => {
        setOpenListForm(false)
        setLoading(true);
        escrow.listItem(data).then(res => {
            if (res["ok"]) {
                toast.success("Item has been listed")
                loadOffers();
            } else {
                toast.error(res["err"])
            };

            setLoading(false)
        });
    }
    const loadOffers = () => {
        let sitype: Itype = { "nft": null };
        switch (itemType) {
            case LIST_ITEM_NFT:
                sitype = { "nft": null };
                break;
            case LIST_ITEM_COIN:
                sitype = { "coin": null };
                break;
            case LIST_ITEM_MERCHANDISE:
                sitype = { "merchandise": null };
                break;
            case LIST_ITEM_SERVICE:
                sitype = { "service": null };
                break;
            case LIST_ITEM_OTHER:
                sitype = { "other": null };
                break;
        };
        setLoading(true)
        escrow.searchItems(sitype, BigInt(1)).then(res => {
            console.log(res)
            setLoading(false)
            setOffers(res)
        })
    };

    function BootstrapDialogTitle(props: DialogTitleProps) {
        const { children, onClose, ...other } = props;

        return (
            <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
                {children}
                {onClose ? (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </DialogTitle>
        );
    }
    const ol =  offers.map(o =>
        (itemType == LIST_ITEM_NFT || itemType == LIST_ITEM_MERCHANDISE ) ? <OfferCard key={o.id} offer={o} /> : <OfferItem key={o.id} offer={o}/>
    )



    return (
        <React.Fragment>

            {isAuthed && <Button variant='contained' onClick={() => setOpenListForm(true)}>List My Item</Button>}
            <Divider />
            <Stack direction="row"
                sx={{ mt: 1 }}
                // justifyContent="center"
                // alignItems="center" 
                spacing={2}>
                <Button variant={itemType == LIST_ITEM_NFT ? "outlined" : "text"} onClick={() => setItemType(LIST_ITEM_NFT)}>NFTs</Button>
                <Button variant={itemType == LIST_ITEM_COIN ? "outlined" : "text"} onClick={() => setItemType(LIST_ITEM_COIN)}>Crypto Currencies</Button>
                <Button variant={itemType == LIST_ITEM_SERVICE ? "outlined" : "text"} onClick={() => setItemType(LIST_ITEM_SERVICE)}>Services</Button>
                <Button variant={itemType == LIST_ITEM_MERCHANDISE ? "outlined" : "text"} onClick={() => setItemType(LIST_ITEM_MERCHANDISE)}>Merchandises</Button>
                <Button variant={itemType == LIST_ITEM_OTHER ? "outlined" : "text"} onClick={() => setItemType(LIST_ITEM_OTHER)}>Others</Button>
            </Stack>

            {(itemType == LIST_ITEM_NFT || itemType == LIST_ITEM_MERCHANDISE) && <Grid
                container
                spacing={2}
                direction="row"

            >
                {ol}
            </Grid>}
            {itemType != LIST_ITEM_NFT &&
                itemType != LIST_ITEM_MERCHANDISE &&
            <Box>
                <List>
                    {ol}
                </List>
                </Box>
            }
            <Dialog
                    maxWidth="md"
                    fullWidth
                    disableEscapeKeyDown={false}
                    open={openListForm}>

                    <BootstrapDialogTitle id="customized-dialog-title" onClose={() => setOpenListForm(false)}>
                        Input Item Information
                    </BootstrapDialogTitle>
                    <ListItemForm submit={saveList} itype={itemType}/>
                </Dialog>
        </React.Fragment>
    );
}