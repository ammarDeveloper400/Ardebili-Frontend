import {Dialog} from "../../../base-components/Headless";
import Button from "../../../base-components/Button";
import Lucide from "../../../base-components/Lucide";
import Table from "../../../base-components/Table";
import { validateEmail, getStatusEnums, getUrgencyEnums } from "../../../utils/functions";
import {isArray} from "lodash";

// @ts-ignore
export default function InfoModal({infoModalPreview, setInfoModalPreview, reqInfo}) {
    if (reqInfo) {
        return (
            <>
                <Dialog staticBackdrop open={infoModalPreview}
                        onClose={() => {
                            setInfoModalPreview(false);
                        }}
                        size={"xl"}
                >
                    <Dialog.Panel>
                        <Dialog.Title>
                            <h2 className="mr-auto text-base font-medium">
                                Request Information
                            </h2>
                        </Dialog.Title>
                        <div className="p-5">
                            <div className="text-slate-500">
                            <div className="overflow-y-auto pt-0 mycustomlabel">
                                <Table className="custom_tabke">
                                    <Table.Tbody>
                                        <Table.Tr>
                                            <Table.Th>Request Date</Table.Th>
                                            <Table.Td>{new Date(reqInfo.asa_request_date).toLocaleString()}</Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th>PM One Name</Table.Th>
                                            <Table.Td>{reqInfo.asa_full_name}</Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th>PM One Email</Table.Th>
                                            <Table.Td>{reqInfo.asa_your_email}</Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th>Job Number</Table.Th>
                                            <Table.Td>{reqInfo.asa_project_no}</Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th>Job Name</Table.Th>
                                            <Table.Td>{reqInfo.asa_project_name}</Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th>Requested Revisions</Table.Th>
                                            <Table.Td>{reqInfo.asa_company_name}</Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th>Contact Person</Table.Th>
                                            <Table.Td>{reqInfo.asa_email}</Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th>Description of Service</Table.Th>
                                            <Table.Td>
                                                <p style={{fontWeight:400}} dangerouslySetInnerHTML={{ __html: reqInfo.service_description }} />
                                            </Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th>Standard Services</Table.Th>
                                            <Table.Td>
                                                {
                                                    reqInfo.standard_services &&
                                                    typeof reqInfo.standard_services === "string" &&
                                                    reqInfo.standard_services?.replaceAll("_", ", ")
                                                }
                                                {
                                                    reqInfo.standard_services &&
                                                    isArray(reqInfo.standard_services) &&
                                                    reqInfo.standard_services.toString()
                                                }
                                            </Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th>Urgency of work</Table.Th>
                                            <Table.Td style={{color: getUrgencyEnums(reqInfo.asa_urgency_work).static_color}}>
                                            
                                                {getUrgencyEnums(reqInfo.asa_urgency_work).title}
                                            </Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th>Discipline</Table.Th>
                                            <Table.Td>{reqInfo.new_asa==1?reqInfo.items_text:reqInfo.discipline}</Table.Td>
                                        </Table.Tr>

                                            {
                                                reqInfo.discipline_data.map((v:any, i:any) => (
                                                    <>
                                                        <Table.Tr>
                                                            <Table.Th>{v.dis_name} Hours Required</Table.Th>
                                                            <Table.Td>{v.hour} Hours</Table.Td>
                                                        </Table.Tr>
                                                        <Table.Tr>
                                                            <Table.Th>{v.dis_name} Scope</Table.Th>
                                                            <Table.Td><pre>{v.task}</pre></Table.Td>
                                                        </Table.Tr>
                                                    </>
                                                )
                                            )}

                                        {
                                            reqInfo.asa_plumbing_scope &&
                                            reqInfo.asa_plumbing_hours &&
                                            <>
                                                <Table.Tr>
                                                    <Table.Th>Plumbing Hours Required</Table.Th>
                                                    <Table.Td>{reqInfo.asa_plumbing_hours}</Table.Td>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th>Plumbing Scope</Table.Th>
                                                    <Table.Td><pre>{reqInfo.asa_plumbing_scope}</pre></Table.Td>
                                                </Table.Tr>
                                            </>
                                        }

                                        {
                                            reqInfo.electrical_scope_description &&
                                            reqInfo.electrical_scope_description &&
                                            <>
                                                <Table.Tr>
                                                    <Table.Th>Electrical Hours Required</Table.Th>
                                                    <Table.Td>{reqInfo.electrical_hours_required}</Table.Td>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th>Electrical Scope</Table.Th>
                                                    <Table.Td><pre>{reqInfo.electrical_scope_description}</pre></Table.Td>
                                                </Table.Tr>
                                            </>
                                        }

                                        {
                                            reqInfo.mechanical_hours &&
                                            reqInfo.mechanical_description &&
                                            <>
                                                <Table.Tr>
                                                    <Table.Th>Mechanical Hours Required</Table.Th>
                                                    <Table.Td>{reqInfo.mechanical_hours}</Table.Td>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th>Mechanical Scope</Table.Th>
                                                    <Table.Td><pre>{reqInfo.mechanical_description}</pre></Table.Td>
                                                </Table.Tr>
                                            </>
                                        }


                                        <Table.Tr>
                                            <Table.Th>Requested Due Date</Table.Th>
                                            <Table.Td>{reqInfo.request_due_date}</Table.Td>
                                        </Table.Tr>

                                        <Table.Tr>
                                            <Table.Th>Second PM Email</Table.Th>
                                            <Table.Td>{reqInfo.send_notification}</Table.Td>
                                        </Table.Tr>


                                    </Table.Tbody>
                                </Table>
                                {/*{reqInfo}*/}
                                </div>
                            </div>
                        </div>
                        <div className="px-5 pb-8 text-center">
                            <Button type="button" variant="outline-secondary" onClick={() => {
                                setInfoModalPreview(false);
                            }} className="w-24 mr-1">
                                Close
                            </Button>
                        </div>
                    </Dialog.Panel>
                </Dialog>

            </>
        )
    } else {
        return (
            <>
                <Dialog open={infoModalPreview} onClose={() => {
                    setInfoModalPreview(false);
                }}>
                    <Dialog.Panel>
                        <Dialog.Title>
                            <h2 className="mr-auto text-base font-medium">
                                Request Information
                            </h2>
                        </Dialog.Title>
                        <div className="p-5">
                            <div className="text-slate-500">
                                Loading...
                            </div>
                        </div>

                        <br/>
                        <br/>
                        <div className="px-5 pb-8 text-center">
                            <Button type="button" variant="outline-secondary" onClick={() => {
                                setInfoModalPreview(false);
                            }} className="w-24 mr-1">
                                Close
                            </Button>
                        </div>
                    </Dialog.Panel>
                </Dialog>

            </>
        )
    }

}
