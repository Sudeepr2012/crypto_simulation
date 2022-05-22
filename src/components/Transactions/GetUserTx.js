import { API_URL } from '../Strings';

export async function getUserTx(address) {
    const res = await fetch(`${API_URL}/userTXs?${new URLSearchParams({ address: address }).toString()}`);
    const data = await res.json();
    return data;
}