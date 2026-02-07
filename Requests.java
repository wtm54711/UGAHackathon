public class Requests {
    private static Node incompleteHead;
    private static Node incompleteTail;
    private static Node completeHead;
    private static Node completeTail;

    // Static inner Node class for LinkedList
    private static class Node {
        Request request;
        Node next;
        Node prev;

        Node(Request request) {
            this.request = request;
            this.next = null;
            this.prev = null;
        }
    }

    // Helper method to add a request to either incomplete or complete list
    private static void addToList(Request request) {
        Node newNode = new Node(request);
        if (request.isCompleted() == false) {
            if (incompleteHead == null) {
                incompleteHead = incompleteTail = newNode;
            } else {
                incompleteTail.next = newNode;
                newNode.prev = incompleteTail;
                incompleteTail = newNode;
            }
        } else {
            if (completeHead == null) {
                completeHead = completeTail = newNode;
            } else {
                completeTail.next = newNode;
                newNode.prev = completeTail;
                completeTail = newNode;
            }
        }
    }

    // Remove a node from incompleteRequests
    private static void removeIncompleteNode(Node node) {
        if (node.prev != null) {
            node.prev.next = node.next;
        } else {
            incompleteHead = node.next;
        }
        if (node.next != null) {
            node.next.prev = node.prev;
        } else {
            incompleteTail = node.prev;
        }
    }

    // Update requests: move completed requests from incomplete to complete
    // Add incomplete request to the list
    public static void addIncompleteRequest(Request request) {
        addToList(request);
    }

    // Update requests: move completed requests from incomplete to complete
    public static void updateRequests(Request request) {
        Node current = incompleteHead;
        while (current != null) {
            Node next = current.next;
            if (current.request.isCompleted()) {
                removeIncompleteNode(current);
                addToList(current.request);
            }
            current = next;
        }
    }

    // Get all incomplete requests
    public static void displayIncompleteRequests() {
        System.out.println("Incomplete Requests:");
        Node current = incompleteHead;
        while (current != null) {
            System.out.println("  ID: " + current.request.getRequestId() + 
                             ", Desc: " + current.request.getRequestDescription() + 
                             ", Difficulty: " + current.request.getRequestDifficulty() + 
                             ", Location: " + current.request.getLocation());
            current = current.next;
        }
    }

    // Get all complete requests
    public static void displayCompleteRequests() {
        System.out.println("Complete Requests:");
        Node current = completeHead;
        while (current != null) {
            System.out.println("  ID: " + current.request.getRequestId() + 
                             ", Desc: " + current.request.getRequestDescription() + 
                             ", Difficulty: " + current.request.getRequestDifficulty() + 
                             ", Location: " + current.request.getLocation());
            current = current.next;
        }
    }

    // Get count of incomplete requests
    public static int getIncompleteCount() {
        int count = 0;
        Node current = incompleteHead;
        while (current != null) {
            count++;
            current = current.next;
        }
        return count;
    }

    // Get count of complete requests
    public static int getCompleteCount() {
        int count = 0;
        Node current = completeHead;
        while (current != null) {
            count++;
            current = current.next;
        }
        return count;
    }

    // Get all requests with specific difficulty (both incomplete and complete)
    public static Request[] getRequestsByDifficulty(int difficulty) {
        java.util.List<Request> results = new java.util.ArrayList<>();
        
        Node current = incompleteHead;
        while (current != null) {
            if (current.request.getRequestDifficulty() == difficulty) {
                results.add(current.request);
            }
            current = current.next;
        }
        
        current = completeHead;
        while (current != null) {
            if (current.request.getRequestDifficulty() == difficulty) {
                results.add(current.request);
            }
            current = current.next;
        }
        
        return results.toArray(new Request[0]);
    }

    // Get incomplete requests with specific difficulty
    public static Request[] getIncompleteRequestsByDifficulty(int difficulty) {
        java.util.List<Request> results = new java.util.ArrayList<>();
        
        Node current = incompleteHead;
        while (current != null) {
            if (current.request.getRequestDifficulty() == difficulty) {
                results.add(current.request);
            }
            current = current.next;
        }
        
        return results.toArray(new Request[0]);
    }

    // Get complete requests with specific difficulty
    public static Request[] getCompleteRequestsByDifficulty(int difficulty) {
        java.util.List<Request> results = new java.util.ArrayList<>();
        
        Node current = completeHead;
        while (current != null) {
            if (current.request.getRequestDifficulty() == difficulty) {
                results.add(current.request);
            }
            current = current.next;
        }
        
        return results.toArray(new Request[0]);
    }

    // Get all requests at specific location (both incomplete and complete)
    public static Request[] getRequestsByLocation(String location) {
        java.util.List<Request> results = new java.util.ArrayList<>();
        
        Node current = incompleteHead;
        while (current != null) {
            if (current.request.getLocation().equals(location)) {
                results.add(current.request);
            }
            current = current.next;
        }
        
        current = completeHead;
        while (current != null) {
            if (current.request.getLocation().equals(location)) {
                results.add(current.request);
            }
            current = current.next;
        }
        
        return results.toArray(new Request[0]);
    }

    // Get all requests from specific requester (both incomplete and complete)
    public static Request[] getRequestsByRequester(User requester) {
        java.util.List<Request> results = new java.util.ArrayList<>();
        
        Node current = incompleteHead;
        while (current != null) {
            if (current.request.getRequester().equals(requester)) {
                results.add(current.request);
            }
            current = current.next;
        }
        
        current = completeHead;
        while (current != null) {
            if (current.request.getRequester().equals(requester)) {
                results.add(current.request);
            }
            current = current.next;
        }
        
        return results.toArray(new Request[0]);
    }

    // Get incomplete requests at specific location
    public static Request[] getIncompleteRequestsByLocation(String location) {
        java.util.List<Request> results = new java.util.ArrayList<>();
        
        Node current = incompleteHead;
        while (current != null) {
            if (current.request.getLocation().equals(location)) {
                results.add(current.request);
            }
            current = current.next;
        }
        
        return results.toArray(new Request[0]);
    }

    // Get complete requests at specific location
    public static Request[] getCompleteRequestsByLocation(String location) {
        java.util.List<Request> results = new java.util.ArrayList<>();
        
        Node current = completeHead;
        while (current != null) {
            if (current.request.getLocation().equals(location)) {
                results.add(current.request);
            }
            current = current.next;
        }
        
        return results.toArray(new Request[0]);
    }

    // Get incomplete requests from specific requester
    public static Request[] getIncompleteRequestsByRequester(User requester) {
        java.util.List<Request> results = new java.util.ArrayList<>();
        
        Node current = incompleteHead;
        while (current != null) {
            if (current.request.getRequester().equals(requester)) {
                results.add(current.request);
            }
            current = current.next;
        }
        
        return results.toArray(new Request[0]);
    }

    // Get complete requests from specific requester
    public static Request[] getCompleteRequestsByRequester(User requester) {
        java.util.List<Request> results = new java.util.ArrayList<>();
        
        Node current = completeHead;
        while (current != null) {
            if (current.request.getRequester().equals(requester)) {
                results.add(current.request);
            }
            current = current.next;
        }
        
        return results.toArray(new Request[0]);
    }
}
