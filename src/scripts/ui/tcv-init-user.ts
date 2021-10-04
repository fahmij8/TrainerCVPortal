/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Swal, { SweetAlertResult } from "sweetalert2";
import { DataSnapshot } from "firebase/database";
import { tcv_Templates } from "../utilities/display/components";
import { userDataObjects } from "../utilities/interface";
import { tcv_FirebaseDB } from "../utilities/firebase/rtdb";
import { tcv_FirebaseStorage } from "../utilities/firebase/storage";
import { tcv_FirebaseAuth } from "../utilities/firebase/auth";
import { tcv_HandlerError, tcv_HandleSuccess } from "../utilities/display/handler";
import * as FilePond from "filepond";
import * as FilePondPluginImagePreview from "filepond-plugin-image-preview";
import * as FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import * as FilePondPluginFileEncode from "filepond-plugin-file-encode";
import * as FilePondPluginFileRename from "filepond-plugin-file-rename";
import * as faceapi from "face-api.js";

export const displayInitUser = async (snapshot: DataSnapshot, mailEdited: string): Promise<boolean> => {
    let resultInit: boolean;

    const setInputFilter = (textbox: Element, inputFilter: (value: string) => boolean): void => {
        ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach((event) => {
            textbox.addEventListener(event, function (this: (HTMLInputElement | HTMLTextAreaElement) & { oldValue: string; oldSelectionStart: number | null; oldSelectionEnd: number | null }) {
                if (inputFilter(this.value)) {
                    this.oldValue = this.value;
                    this.oldSelectionStart = this.selectionStart;
                    this.oldSelectionEnd = this.selectionEnd;
                } else if (Object.prototype.hasOwnProperty.call(this, "oldValue")) {
                    this.value = this.oldValue;
                    if (this.oldSelectionStart !== null && this.oldSelectionEnd !== null) {
                        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                    }
                } else {
                    this.value = "";
                }
            });
        });
    };

    if (!snapshot.exists()) {
        await Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri("https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/"), faceapi.nets.faceLandmark68Net.loadFromUri("https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/"), faceapi.nets.faceRecognitionNet.loadFromUri("https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/"), faceapi.nets.faceExpressionNet.loadFromUri("https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/")])
            .then(() => console.info("[INFO] Model loaded successfully"))
            .catch((error) => {
                console.error(error);
                tcv_HandlerError.show_NoConfirm("Failed to loade face-api models");
            });
        // eslint-disable-next-line prefer-const
        let photoFile = {};
        // eslint-disable-next-line prefer-const
        let photoUrl = "";
        const { value: formValues }: SweetAlertResult = await Swal.fire({
            title: "Student Data",
            html: tcv_Templates.newUsers,
            focusConfirm: false,
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: true,
            preConfirm: () => {
                $(".needs-validation").addClass("was-validated");
                const nimValue: string | number | string[] = $("#tcv-nim").val();
                const majorValue: string | number | string[] = $("#tcv-major").val();
                const telValue: string | number | string[] = $("#tcv-tel").val();
                if (photoUrl === "") {
                    $(".tcv-photos-warn").addClass("d-block");
                } else {
                    if (nimValue !== "" && majorValue !== null && telValue !== "62" && telValue !== "6") {
                        $(".tcv-photos-warn").removeClass("d-block");
                        return [nimValue, majorValue, telValue, photoUrl];
                    }
                }

                return false;
            },
            didOpen: (): void => {
                setInputFilter(document.getElementById("tcv-tel"), (value) => {
                    if (value === "") {
                        return true;
                    } else {
                        return /^\d+$/.test(value);
                    }
                });
                FilePond.registerPlugin(FilePondPluginFileRename, FilePondPluginFileEncode, FilePondPluginImagePreview, FilePondPluginFileValidateType);
                FilePond.create($("#tcv-photos").get(0), {
                    maxFiles: 1,
                    allowImagePreview: true,
                    allowFileRename: true,
                    acceptedFileTypes: ["image/*"],
                    required: true,
                    allowFileEncode: true,
                    onpreparefile: async (item) => {
                        photoFile[item.id] = [item.filename, (item as any).getFileEncodeDataURL()];
                    },
                    onremovefile: (error, file) => {
                        tcv_FirebaseStorage
                            .deleteFile(`images/${photoFile[file.id][0]}`)
                            .then(() => {
                                delete photoFile[file.id];
                                photoUrl = "";
                            })
                            .catch((error) => {
                                if (error.code === "storage/object-not-found") {
                                    delete photoFile[file.id];
                                    photoUrl = "";
                                } else {
                                    console.error(error);
                                    tcv_HandlerError.show_NoConfirm("Firebase Storage failed to remove user photo");
                                }
                            });
                    },
                    server: {
                        process: async (fieldName, file, metadata, load, error, progress, abort) => {
                            $(".tcv-photos-warn").removeClass("d-block");
                            $(".swal2-confirm").attr("disabled", "");
                            const image = await faceapi.bufferToImage(file);
                            $(".tcv-photos-container").append(image);
                            const canvas = faceapi.createCanvasFromMedia(image);
                            $(".tcv-photos-container").append(canvas);
                            const displaySize = { width: image.width, height: image.height };
                            faceapi.matchDimensions(canvas, displaySize);
                            const detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
                            const resizedDetections = faceapi.resizeResults(detections, displaySize);
                            if (resizedDetections.length == 1) {
                                console.info("[INFO] Face is detected on uploaded photos");
                                if (resizedDetections[0].detection.classScore > 0.6) {
                                    const task = tcv_FirebaseStorage.uploadFile(`images/${file.name}`, file, metadata);
                                    task.on(
                                        "state_changed",
                                        (snap) => progress(true, snap.bytesTransferred, snap.totalBytes),
                                        (err) => error(err.message),
                                        () => {
                                            tcv_FirebaseStorage
                                                .getURL(`images/${file.name}`)
                                                .then((url) => {
                                                    const xhr = new XMLHttpRequest();
                                                    xhr.responseType = "blob";
                                                    xhr.onload = () => {
                                                        photoUrl = url;
                                                        const blob = xhr.response;
                                                        $(".swal2-confirm").removeAttr("disabled");
                                                        load(blob);
                                                    };
                                                    xhr.onerror = (error) => {
                                                        console.error(error);
                                                        tcv_HandlerError.show_NoConfirm("Firebase Storage failed to show user photo");
                                                    };
                                                    xhr.open("GET", url);
                                                    xhr.send();
                                                })
                                                .catch((error) => {
                                                    console.error(error);
                                                    tcv_HandlerError.show_NoConfirm("Firebase Storage failed to upload user photo");
                                                });
                                        }
                                    );
                                    return {
                                        abort: () => {
                                            $(".tcv-photos-warn").removeClass("d-block");
                                            $(".swal2-confirm").removeAttr("disabled");
                                            task.cancel();
                                            abort();
                                        },
                                    };
                                }
                            } else {
                                $(".tcv-photos-warn").addClass("d-block");
                                $(".swal2-confirm").removeAttr("disabled");
                                abort();
                            }
                        },
                        revert: (uniqueFileId, load, error) => {
                            return load();
                        },
                    },
                });
                FilePond.setOptions({
                    fileRenameFunction: (file) => {
                        if (file.extension !== ".jpg") {
                            file.extension = ".jpg";
                        }
                        return `user-${tcv_FirebaseAuth.currentUser().displayName}-${new Date().getTime()}${file.extension}`;
                    },
                });
                $(".filepond--credits").remove();
            },
        });

        if (formValues) {
            const data = tcv_FirebaseAuth.currentUser();
            await tcv_FirebaseDB
                .postData(`users/${mailEdited}`, userDataObjects(data, formValues))
                .then(() => {
                    tcv_HandleSuccess.show_Confirm("Thank you, have a good day!");
                    resultInit = true;
                })
                .catch((error) => {
                    console.error(error);
                    tcv_HandlerError.show_NoConfirm("Firebase RTDB failed to submit user data");
                    resultInit = false;
                });
        }
    } else {
        resultInit = true;
    }
    return resultInit;
};
