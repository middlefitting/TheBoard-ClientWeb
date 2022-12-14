import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import AuthContext from "../../store/context/auth-context";
import Form from "react-bootstrap/Form";
import {Container} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {errorActions} from "../../store/redux/errorSlice";
import {alertActions} from "../../store/redux/alertSlice";
import {warningActions} from "../../store/redux/warningSlice";
import {useDispatch} from "react-redux";
import {useMutation} from "react-query";
import {emailCheckRequest, nicknameCheckRequest, signUpRequest} from "../../request/usersRequest";

export default function SignUpForm(props: any) {

    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredNickname, setEnteredNickname] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [enteredRepeatPassword, setEnteredRepeatPassword] = useState('');
    const [passwordEqual, setPasswordEqual] = useState(false);
    const [emailDuplicateCheck, setEmailDuplicateCheck] = useState(false)
    const [nicknameDuplicateCheck, setNicknameDuplicateCheck] = useState(false)
    const [emailEntered, setEmailEntered] = useState(false);
    const [nicknameEntered, setNicknameEntered] = useState(false);
    const [passwordEntered, setPasswordEntered] = useState(false);
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext);
    const isLogin = authCtx.isLoggedIn;
    const dispatch = useDispatch();

    useEffect(() => {
        if (isLogin) {
            navigate("/home")
        }
    }, [isLogin]);


    const signUpMutation = useMutation((params : any ) => signUpRequest(params.email, params.nickname, params.password), {
        onSuccess: (response) => {
            setEmailDuplicateCheck(true);
            setEnteredEmail('');
            setEnteredNickname('');
            setEnteredPassword('');
            setEnteredRepeatPassword('');
            navigate("/home");
            dispatch(alertActions.setMessage("??????????????? ?????????????????????!"));
            dispatch(alertActions.open());
        },
        onError: (error : any) => {
            dispatch(errorActions.setStatus(error.response.data.status));
            dispatch(errorActions.setMessage(error.response.data.message));
            dispatch(errorActions.setCode(error.response.data.code));
            dispatch(errorActions.open());
        },
    });

    const emailCheckMutation = useMutation((params: string ) => emailCheckRequest(params), {
        onSuccess: (response) => {
            setEmailDuplicateCheck(true);
        },
        onError: (error : any) => {
            dispatch(alertActions.setMessage(error.response.data.message));
            dispatch(alertActions.open());
        },
    });

    const nicknameCheckMutation = useMutation((params: string ) => nicknameCheckRequest(params), {
        onSuccess: (response) => {
            setNicknameDuplicateCheck(true);
        },
        onError: (error : any) => {
            dispatch(alertActions.setMessage(error.response.data.message));
            dispatch(alertActions.open());
        },
    });


    const addUserHandler = (event: React.FormEvent) => {
        event.preventDefault();
        if (enteredNickname.trim().length === 0 || enteredNickname.trim().length === 0) {
            return;
        }
        const params = {
            email: enteredEmail.trim(),
            nickname: enteredNickname.trim(),
            password: enteredPassword.trim(),
        }
        signUpMutation.mutate(params)
    };


    const emailChangeHandler = (event: any) => {
        setEnteredEmail(event.currentTarget.value);
        setEmailDuplicateCheck(false)
        setEmailEntered(true)
    };

    const nicknameChangeHandler = (event: any) => {
        setEnteredNickname(event.currentTarget.value);
        setNicknameDuplicateCheck(false)
        setNicknameEntered(true)
    };

    const passwordChangeHandler = (event: any) => {
        setEnteredPassword(event.currentTarget.value);
        setPasswordEqual(false)
        setPasswordEntered(true)
    };

    const repeatPasswordChangeHandler = (event: any) => {
        setEnteredRepeatPassword(event.currentTarget.value);
        setPasswordEqual(false)
    };

    const emailDuplicateCheckHandler = (event: any) => {
        if (!emailParseCheckHandler()) {
            return
        }
        emailCheckMutation.mutate(enteredEmail.trim())
    }

    const nicknameDuplicateCheckHandler = (event: any) => {
        if (!nicknameParseCheckHandler()) {
            return
        }
        nicknameCheckMutation.mutate(enteredNickname.trim());
    }

    const equalPasswordCheckHandler = (event: any) => {
        if (!passwordParseCheckHandler()) {
            return
        }

        if (enteredRepeatPassword.trim().length === 0) {
            dispatch(alertActions.setMessage("?????? ??????????????? ??????????????????!"));
            dispatch(alertActions.open());
            return
        }

        if (enteredPassword.trim() !== enteredRepeatPassword.trim()) {
            dispatch(alertActions.setMessage("??????????????? ???????????? ????????????!"));
            dispatch(alertActions.open());
            return
        }
        if (enteredPassword === enteredRepeatPassword) {
            setPasswordEqual(true);
        }
    }

    const emailParseCheckHandler = () => {
        const regex = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        return regex.test(enteredEmail.trim())
    }

    const nicknameParseCheckHandler = () => {
        if (enteredNickname.trim().length < 4 || enteredNickname.trim().length > 20) {
            return false
        }
        return true
    }

    const passwordParseCheckHandler = () => {
        if (enteredPassword.trim().length < 10 || enteredPassword.trim().length > 20) {
            return false
        }
        return true
    }

    const undoHandler = () => {
        navigate("/home");
    }

    const undoCheck = () => {
        dispatch(warningActions.setMessage("??????????????? ???????????????"));
        dispatch(warningActions.open());
        dispatch(warningActions.setFunction(undoHandler));
    }

    return (
        <>
            <Container
                className={"mx-auto my-3 container-sm"}
                style={{maxWidth: "540px"}}
            >
                <br/>
                <h2 className={"text-center"}>
                    <strong>????????????</strong>
                </h2>
                <Form onSubmit={addUserHandler}>
                    <Form.Group className="mb-3">
                        <Form.Label><strong>?????????</strong></Form.Label>
                        <Form.Control
                            placeholder="???????????? ????????? ?????????"
                            id="email"
                            type="email"
                            required={true}
                            value={enteredEmail}
                            onChange={emailChangeHandler}
                            isValid={emailEntered && emailParseCheckHandler()}
                            isInvalid={emailEntered && !emailParseCheckHandler()}
                        />
                        <Form.Control.Feedback>????????? ???????????????</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            ????????? ????????? ????????? ????????? ?????????!
                        </Form.Control.Feedback>
                    </Form.Group>
                    <div className="d-grid mb-3">
                        <Button type="button" variant={"outline-primary"} onClick={emailDuplicateCheckHandler}
                                disabled={emailDuplicateCheck}>
                            {emailDuplicateCheck ? "?????? ????????? ??????????????????!" : "????????? ?????? ??????"}
                        </Button>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label><strong>?????????</strong></Form.Label>
                        <Form.Control
                            placeholder="???????????? ????????? ?????????"
                            id="nickname"
                            type="text"
                            required={true}
                            value={enteredNickname}
                            onChange={nicknameChangeHandler}
                            isValid={nicknameEntered && nicknameParseCheckHandler()}
                            isInvalid={nicknameEntered && !nicknameParseCheckHandler()}
                        />
                        <Form.Control.Feedback>????????? ???????????????</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            ???????????? 4 ~ 20 ?????? ????????? ????????? ?????????!
                        </Form.Control.Feedback>
                    </Form.Group>
                    <div className="d-grid mb-3">
                        <Button type="button" variant={"outline-primary"} onClick={nicknameDuplicateCheckHandler}
                                disabled={nicknameDuplicateCheck}>
                            {nicknameDuplicateCheck ? "?????? ????????? ??????????????????!" : "????????? ?????? ??????"}
                        </Button>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label><strong>????????????</strong></Form.Label>
                        <Form.Control
                            placeholder="??????????????? ????????? ?????????"
                            id="password"
                            type="password"
                            required={true}
                            value={enteredPassword}
                            onChange={passwordChangeHandler}
                            isValid={passwordEntered && passwordParseCheckHandler()}
                            isInvalid={passwordEntered && !passwordParseCheckHandler()}
                        />
                        <Form.Control.Feedback>????????? ???????????????</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            ??????????????? 10 ~ 20 ?????? ????????? ????????? ?????????!
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control
                            placeholder="?????? ??????????????? ????????? ?????????"
                            id="repeat_password"
                            type="password"
                            value={enteredRepeatPassword}
                            onChange={repeatPasswordChangeHandler}
                        />
                    </Form.Group>
                    <div className="d-grid mb-5">
                        <Button type="button" variant={"outline-primary"} onClick={equalPasswordCheckHandler}
                                disabled={passwordEqual}>
                            {passwordEqual ? "????????? ?????????????????????!" : "???????????? ??????"}
                        </Button>
                    </div>
                    <div className="d-grid mb-3">
                        <Button
                            type="submit"
                            disabled={!(nicknameDuplicateCheck && emailDuplicateCheck && passwordEqual)}>
                            ????????????
                        </Button>
                    </div>
                    <div className="d-grid mb-3">
                        <Button
                            variant={"outline-danger"}
                            onClick={undoCheck}>
                            ??????
                        </Button>
                    </div>
                </Form>
            </Container>
        </>
    );
}

{/*<div className={classes.input}>*/
}
{/*    <form onSubmit={addUserHandler}>*/
}
{/*        <label htmlFor="email">Email</label>*/
}
{/*        <input*/
}
{/*            id="email"*/
}
{/*            type="email"*/
}
{/*            required={true}*/
}
{/*            value={enteredEmail}*/
}
{/*            onChange={emailChangeHandler}*/
}
{/*        />*/
}
{/*        {!emailDuplicateCheck ?*/
}
{/*            <input type="button" onClick={emailDuplicateCheckHandler} value={"????????? ?????? ??????"}/> :*/
}
{/*            <input type="button" value={"?????? ????????? ??????????????????!"}/>}*/
}
{/*        <label htmlFor="nickname">Nickname</label>*/
}
{/*        <input*/
}
{/*            id="nickname"*/
}
{/*            type="text"*/
}
{/*            required={true}*/
}
{/*            value={enteredNickname}*/
}
{/*            onChange={nicknameChangeHandler}*/
}
{/*        />*/
}
{/*        {!nicknameDuplicateCheck ?*/
}
{/*            <input type="button" onClick={nicknameDuplicateCheckHandler} value={"????????? ?????? ??????"}/> :*/
}
{/*            <input type="button" value={"?????? ????????? ??????????????????!"}/>}*/
}
{/*        <label htmlFor="password">Password</label>*/
}
{/*        <input*/
}
{/*            id="password"*/
}
{/*            type="text"*/
}
{/*            required={true}*/
}
{/*            value={enteredPassword}*/
}
{/*            onChange={passwordChangeHandler}*/
}
{/*        />*/
}
{/*        <label htmlFor="repeat_password">Repeat Password</label>*/
}
{/*        <input*/
}
{/*            id="repeat_password"*/
}
{/*            type="text"*/
}
{/*            value={enteredRepeatPassword}*/
}
{/*            onChange={repeatPasswordChangeHandler}*/
}
{/*        />*/
}
{/*        <input type="button" onClick={equalPasswordCheckHandler} value={"??????????????????"}/>*/
}
{/*        /!*<button type="button" onClick={equalPasswordCheckHandler}>???????????? ??????</button>*!/*/
}
{/*        {nicknameDuplicateCheck && emailDuplicateCheck && passwordEqual &&*/
}
{/*            <button type="submit">Add User</button>}*/
}
{/*    </form>*/
}
{/*    /!*</Card>*!/*/
}
{/*</div>*/
}
