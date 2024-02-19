import { useCallback, useState } from "react"
import { RequestByEmployeeParams, SetTransactionApprovalParams, Transaction } from "../utils/types"
import { TransactionsByEmployeeResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"
import { SetTransactionApprovalFunction } from "src/components/Transactions/types"

export function useTransactionsByEmployee(): TransactionsByEmployeeResult {
  const { fetchWithCache, fetchWithoutCache, loading } = useCustomFetch()
  const [transactionsByEmployee, setTransactionsByEmployee] = useState<Transaction[] | null>(null)

  const fetchById = useCallback(
    async (employeeId: string) => {
      const data = await fetchWithCache<Transaction[], RequestByEmployeeParams>(
        "transactionsByEmployee",
        {
          employeeId,
        }
      )

      setTransactionsByEmployee(data)
    },
    [fetchWithCache]
  )

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      console.log(transactionsByEmployee)

      const data = await fetchWithoutCache<Transaction[] | null, SetTransactionApprovalParams>(
        "setTransactionApproval",
        {
          transactionId,
          value: newValue,
        }
      )

      console.log(data)
      setTransactionsByEmployee(data)
    },
    [fetchWithoutCache]
  )

  const invalidateData = useCallback(() => {
    setTransactionsByEmployee(null)
  }, [])

  return { data: transactionsByEmployee, loading, fetchById, setTransactionApproval, invalidateData }
}
